#encoding="utf-8"
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
        print(name+' '+userDict[name]+'\n')
        counter=counter+1
    if counter>0:
        return True
    else:#空白页
        return False
        
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
username=b'buaa1106'
password=b'scse1506'
#编码规范化&加密，并将结果转换成字符串
input1=str(username,'utf-8')
input2=str(b64encode(encryptor.encrypt(password)),'utf-8')

payload = {
    'uname': input1,
    'upass': input2
}
#def personal_info_collector():
    
#target_file=open("e://target.html",mode="w",encoding="utf-8")
with session() as c:
    response=c.post('http://www.bv2008.cn/app/user/login.php?m=login',payload)
    response = c.get('http://www.bv2008.cn/app/org/member.php?&p=1&p=16&p=1')
    userDict={}
    pageNo=1
    while per_page_collector(str(response.text)):
        pageNo=pageNo+1
        response = c.get('http://www.bv2008.cn/app/org/member.php?&p=1&p=16&p='+str(pageNo))
    #response = c.get('http://www.bv2008.cn/app/org/member.php?&p=1&p=16&p=17')
    #target_file.write(str(response.headers))
    #per_page_collector(str(response.text))
    #target_file.write(str(response.text))
#target_file.close()
