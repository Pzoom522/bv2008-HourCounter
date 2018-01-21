import base64
from Crypto.Cipher import PKCS1_v1_5 as Cipher_pkcs1_v1_5
from Crypto.PublicKey import RSA
from requests import session
import rsa

pubKey = '''-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCbJ2QYNdiFlzE0mcyq7tcZc5dP
vof6696l2cJJM8kOxeXT8EonfvLzfsEGmwjNp3gvAyF14LvqT6w7oH40sFFnX358
Eb+HZXx6CZ4LOkaTW0KNS6yodsRv0uwJhFMwREqEVbqd6jcCxTGKDOieendC8x1f
sg3Muagyfawc+o+tewIDAQAB
-----END PUBLIC KEY-----'''

pas_wd='scse1506'
rsakey=RSA.impoerKey(pubKey)
cipher=Cipher_pkcs1_v1_5.new(rsakey)
cipher_text=base64.b64encode(cipher.encrypt(pas_wd))

payload = {
    'uname': 'buaa1106',
    'upass': str(cipher_text),
    'referer': 'http://www.bv2008.cn/app/user/home.php'
}

with session() as c:
    c.post('http://www.bv2008.cn/app/org/member.php?m=login', data=payload)
    response = c.get('http://www.bv2008.cn/app/user/home.php')
    print(response.headers)
    print(response.text)
