#encoding="utf-8"

#志愿北京团体成员时长统计平台
# Powered by *Oynnl@BUAA1506*

from base64 import b64encode
from Crypto.Cipher import PKCS1_v1_5
from Crypto.PublicKey import RSA
from requests import session

def per_page_collector(page):#每页中的个人信息
    global userDict
    lineList=page.split('\n')#按行切分
    startIndex=lineList.index('<th width="80">居住区域</th><th>申请时间</th><th>总时长</th><th>去年时长</th><th>今年时长</th>')+2
    counter=0
    while '<a target="_blank" href="/app/sys/view.vol.php?uid=' in lineList[startIndex+counter*15+4]:
        info=lineList[startIndex+counter*15+4]
        cut=info.index('">')
        uid=info[51:cut]
        if '<font color=green>' in info:#正常认证
            name=info[cut+20:-15]
        else:#认证无结果
            name=info[cut+2:-8]
        if name in userDict:#重名
            userDict[name]='+'
        else:
            userDict[name]=uid
        counter=counter+1
    if counter>0:
        return True
    else:#空白页
        return False

def per_page_counter(startDate,endDate,page):#每页中的有效时长
    pageTotal=0 #页内时长
    lineList=page.split('\n')#按行切分
    startIndex=lineList.index('<tr><th>服务项目</th><th width="80">服务时长</th><th width="80">添加方式</th><th width="80">状态</th><th width="150">日期</th></tr>')+1
    counter=0
    while '<a target="_blank" href="/app/opp/view.php?id=' in lineList[startIndex+counter*9+2]:
        #单个项目
        hour=lineList[startIndex+counter*9+4]
        hour=hour[4:len(hour)-6]#时长，一位小数
        valid=lineList[startIndex+counter*9+6]#状态，{已生效,}
        time=lineList[startIndex+counter*9+7]
        time=time[4:14].replace('-','')#日期，YYYYMMDD
        if (int(time)>=startDate and int(time)<=endDate) and ('已生效' in valid):
            pageTotal=pageTotal+float(hour)
        counter=counter+1
    return pageTotal


def post_data_producer(username,password):

    key_bytes=b"-----BEGIN PUBLIC KEY-----\n\
    MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCbJ2QYNdiFlzE0mcyq7tcZc5dP\n\
    vof6696l2cJJM8kOxeXT8EonfvLzfsEGmwjNp3gvAyF14LvqT6w7oH40sFFnX358\n\
    Eb+HZXx6CZ4LOkaTW0KNS6yodsRv0uwJhFMwREqEVbqd6jcCxTGKDOieendC8x1f\n\
    sg3Muagyfawc+o+tewIDAQAB\n\
    -----END PUBLIC KEY-----"

    #生成Crypto.PublicKey.RSA._RSAobj类型的对象
    publickey=RSA.importKey(key_bytes)
    #构造“加密器”
    encryptor=PKCS1_v1_5.new(publickey)
    #加密的内容必须为bytes类型
    username=str.encode(username)
    password=str.encode(password)
    #编码规范化&加密，并将结果转换成字符串
    input1=str(username,'utf-8')
    input2=str(b64encode(encryptor.encrypt(password)),'utf-8')

    payload = {
        'uname': input1,
        'upass': input2
    }
    return payload

input_file=open("../workplace/input.csv",mode='r',encoding='utf-8')
output_file=open("../workplace/output.csv",mode='w',encoding='utf-8')
print('============')
print('----志愿北京团体成员时长统计平台----')
print('powered by *Oynnl@BUAA1506*\n')
uname=input('“志愿北京”团体帐号：')
upass=input('“志愿北京”团体密码：')
print('-------')
startDate=int(input('请输入查询起点（YYYYMMDD）：'))
endDate=int(input('请输入查询终点（YYYYMMDD）：'))

userDict={}

with session() as c:#保持会话状态
    c.post('http://www.bv2008.cn/app/user/login.php?m=login',post_data_producer(uname,upass))#实现登陆

    #建立字典：{姓名:uid}
    response = c.get('http://www.bv2008.cn/app/org/member.php?&p=1')
    pageNo=1
    while per_page_collector(str(response.text)):
        pageNo=pageNo+1
        response = c.get('http://www.bv2008.cn/app/org/member.php?&p='+str(pageNo))

    #逐个计算时长
    name=input_file.readline().strip('\n')
    if name[0]=='\ufeff':#BOM编码问题
        name=name[1:]
        print(name)
    else:
        print(name)
    while name:
        if name in userDict:
            print(name)
            if userDict[name]=='+':
                output_file.write(name+','+'重名\n')
            else:#常规情况
                url='http://www.bv2008.cn/app/sys/view.vol.php?type=hour&uid='+userDict[name]
                totalHour=0
                pageNo=1
                while True:#对每个人的时长页，逐页扫描
                    response = c.get(url+'&p='+str(pageNo))
                    if per_page_counter(startDate,endDate,str(response.text))==0:
                        break
                    else:
                        totalHour=totalHour+per_page_counter(startDate,endDate,str(response.text))
                        pageNo=pageNo+1
                output_file.write(name+','+str(totalHour)+'\n')
        else:
            output_file.write(name+','+'暂未加入团体\n')
        name=input_file.readline().strip('\n')

input_file.close()
output_file.close()
