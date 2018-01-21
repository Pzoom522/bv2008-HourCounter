file=open("C://Users/Pzoom/Documents/GitHub/bv2008-HourCounter/pages/target.html",mode='r',encoding='utf-8')

lineList = file.readlines()
startIndex=lineList.index('<tr><th>服务项目</th><th width="80">服务时长</th><th width="80">添加方式</th><th width="80">状态</th><th width="150">日期</th></tr>\n')+1
counter=0
while '<a target="_blank" href="/app/opp/view.php?id=' in lineList[startIndex+counter*9+2]:
    hour=lineList[startIndex+counter*9+4]
    valid=lineList[startIndex+counter*9+6]
    time=lineList[startIndex+counter*9+7]
    print('【'+hour+valid+time+'】\n')
    counter=counter+1
