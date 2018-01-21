#encoding="utf-8"
from base64 import b64encode
from Crypto.Cipher import PKCS1_v1_5 
from Crypto.PublicKey import RSA
from requests import session

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

target_file=open("e://target.html",mode="w",encoding="utf-8")
with session() as c:
    response=c.post('http://www.bv2008.cn/app/user/login.php?m=login',payload)
    response = c.get('http://www.bv2008.cn/app/sys/view.vol.php?type=hour&uid=15195276&p=2')
    #target_file.write(str(response.headers))
    target_file.write(str(response.text))
target_file.close()
