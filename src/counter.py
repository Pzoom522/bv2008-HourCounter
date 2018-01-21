class targetUser:
    def __init__(self,uid,sessionName,startDate,endDate):
        self.id=int(uid)#志愿北京编号
        self.s=sessionName
        self.start=startDate
        self.end  =  endDate
        self.total=0#总时长

    def get_page(self,pageNo):
        url='http://www.bv2008.cn/app/sys/view.vol.php?type=hour&uid='+self.id+'&p='+int(pageNo)
        response = self.s.get(url)

    def work(self):
        initPage=0
        while self.perPage()!=0:
            
        
    file=open("e://target.html",mode='r',encoding='utf-8')
total=0
startDate=20160101
endDate=20160607
lineList = file.readlines()
startIndex=lineList.index('<tr><th>服务项目</th><th width="80">服务时长</th><th width="80">添加方式</th><th width="80">状态</th><th width="150">日期</th></tr>\n')+1
counter=0
while '<a target="_blank" href="/app/opp/view.php?id=' in lineList[startIndex+counter*9+2]:
    #单个项目
    hour=lineList[startIndex+counter*9+4]
    hour=hour[4:len(hour)-6]#时长，一位小数
    valid=lineList[startIndex+counter*9+6]#状态，{已生效,}
    time=lineList[startIndex+counter*9+7]
    time=time[4:14].replace('-','')#日期，YYYYMMDD
    if (int(time)>=startDate and int(time)<=endDate) and ('已生效' in valid):
        total=total+float(hour)
    counter=counter+1
print(total)
