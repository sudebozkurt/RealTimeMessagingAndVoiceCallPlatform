# WhatsApp Clone - Veritabanı 

Bu bir WhatsApp klonu uygulaması için tasarlanmış MySQL veritabanını içerir.


## Tablolar

- Users
- Sessions
- Messages
- UserVerification
- Calls
- BroadcastMessages
- BroadcastMessageRecipients


## Kullanım

Bu şemayı kullanmak için:

1. Bir MySQL veritabanı sunucusu oluşturun.
2. Bu repo'daki SQL betiğini veritabanınıza aktarın.


##  Şema Bilgisi

MySQL veritabanı şemasını açıklamaktadır.

Tablolar
1. Users
Kullanıcı bilgilerini depolar.

2. Sessions
Kullanıcı oturumlarını yönetir.

3. Messages
Gönderilen birebir mesajları depolar.

4. UserVerification
İki faktörlü kimlik doğrulama (2FA) bilgilerini depolar.

5. Calls
Gerçekleştirilen aramaların bilgilerini depolar.

6. BroadcastMessages
Toplu mesaj bilgilerini depolar.

7. BroadcastMessageRecipients
Toplu mesaj alıcılarını ve teslimat durumlarını depolar.


## indexler
Aşağıdaki indeksler, veritabanı sorgularını hızlandırmak için oluşturulmuştur.


## İlişkiler
Users tablosu; Sessions, Messages, UserVerification, Calls, BroadcastMessages ve BroadcastMessageRecipients tablolarına bire-çok (one-to-many) ilişkiyle bağlıdır.

Sessions tablosu, Users tablosuna çok-bir (many-to-one) ilişkiyle bağlıdır.

Messages tablosu, Users tablosuna (hem gönderen hem de alıcı için) çok-bir (many-to-one) ilişkiyle bağlıdır.

UserVerification tablosu, Users tablosuna birebir (one-to-one) ilişkiyle bağlıdır.

Calls tablosu, Users tablosuna (hem arayan hem de aranan için) çok-bir (many-to-one) ilişkiyle bağlıdır.

BroadcastMessages tablosu, Users tablosuna çok-bir (many-to-one) ilişkiyle bağlıdır.

BroadcastMessageRecipients tablosu, BroadcastMessages ve Users tablolarına çok-bir (many-to-one) ilişkiyle bağlıdır.