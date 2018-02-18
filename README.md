## CryptoPro CSP

Требуется установка программы cryptoPro (КриптоПро CSP) на машину пользователя 
и плагин для браузерав котором будет производиться подпись.

На данный момент создание сертификата поддерживается в Windows и Mac Os
Заверить созданный сертификат получается только из под Windows

Поэтому лучше изначально все делать из под Windows.
Подпись работет в Chrome, FireFox, Internet Explorer, Edge

Плагины для браузеров идут вместе с пакем программ от cryptoPro

Для Chrome и FireFox можно найти в [магазине приложений](https://chrome.google.com/webstore/detail/cryptopro-extension-for-c/iifchhfnnmpdbibifmljnfjhpififfog?hl=ru) 



Файл `cadesplugin_api.js` это официальный код от cryptoPro.
Если нужно обновить, то переходим по [ссылке](https://www.cryptopro.ru/sites/default/files/products/cades/cadesplugin_api.js)
и вставляем содержимое в тело функции `function cryptoProPlugin() {`

Найти в коде места где создаются объекты и вставляются в DOM `var elem1 = document.createElement('object');`
скрыть эти блоки 
```
elem1.setAttribute("style", "visibility: hidden");
elem1.style.height = "0";
elem1.style.width = "0";
elem1.style.position = "fixed";
elem1.style.left = "-100px";
elem1.style.top = "-100px";
``` 

Версия js модуля -- `cadesplugin.JSModuleVersion = "2.1.0";`

Файл `constants.js` - настройки для программы cryptoPro при создании пары ключей сертификата

Файл `cryptopro.js` - фасад CryptoProService, вызываем методы crypto.
* поиск сертификата
* создание пары ключей
* подпись документов
* информация о плагине


### Пример подписи документов ( redux-saga )
```
/**
 * Подписываем документ при помощи плагина Crypto и сервиса CryptoProService
 * для некоторых документов не приходит digest - Promise.resolve({ recordID: document, notDigest: true })
 * @param doc
 * @param signer
 */
export const signDoc = (doc, signer, document) => (
  doc
    ? CryptoProService.createDetachedSign(doc, signer)
    : Promise.resolve({ recordID: document, notDigest: true })
);
```
```
export function* signDocuments() {
  // объект digests для подписи
  const digestsSign = yield select(createSignResultSelector);
  const { docIds, digests, cert } = digestsSign.toJS();

  try {      
    yield CryptoProService.pluginInfo(); // информация по плагину
    
    const foundCert = yield CryptoProService.findCert(cert.content); // поиск сертификата
    
    yield CryptoProService.isOnToken(foundCert);
    
    const signer = yield CryptoProService.signer(foundCert);
    
    // групповая подпись
    const signedCollection = yield all(docIds.map(document =>
      call(signDoc, digests.find(d => d.recordID === document), signer, document)
    ));
    
    const signedCollectionResolved = yield all(compact(signedCollection)
      .map(({ recordID, sign, notDigest }) => 
        ({ docId: recordID, sign, notDigest })
      )
    );
    
    const compileForSign = signedCollectionResolved.filter(d => !d.notDigest);
    const compileNotSign = signedCollectionResolved.filter(d => d.notDigest);
    
    // сохраняем подписанные и не подписанные документы
    yield put(saveSignedDocumentsWithCryptoProAction(compileForSign, compileNotSign));
    
    // отправка подписи на сервер
    const resultSaveData = yield call(saveSignStatusSaga, compileForSign);
       
  } catch (error) {
    console.log(error)
  }
}

```

### С бэкенда необходимо получить по `id` документа 
```
{  
   "digests":[  
      {  
         "recordID":"2f15ecec-0c3d-47b2-9686-e84566127a7e",
         "digest":"W9Cf0LvQsNGC0LXQttC90L7QtSDQv9C+0YDRg9GH0LXQvdC40LVdCtCd0L7QvNC10YAg0LTQvtC60YPQvNC10L3RgtCwPTE3MArQndCw0LjQvNC10L3QvtCy0LDQvdC40LUg0L7RgNCz0LDQvdC40LfQsNGG0LjQuCDQsNCy0YLQvtGA0LAg0LTQvtC60YPQvNC10L3RgtCwPdCe0J7QniDQldCi0JoK0KHRg9C80LzQsCDQtNC+0LrRg9C80LXQvdGC0LAsINC60L7RgtC+0YDRi9C8INCx0YvQu9C+INGB0YTQvtGA0LzQuNGA0L7QstCw0L3QsCDQtNCw0L3QvdCw0Y8g0L7Qv9C10YDQsNGG0LjRjz0xMDAwMDAK0JTQsNGC0LAg0LTQvtC60YPQvNC10L3RgtCwPTE2LjAyLjIwMTggMDA6MDA6MDAK0KHRg9C80LzQsCDQndCU0KE9MTUyNTQuMjQK0KHRgtCw0LLQutCwINCd0JTQoT0xOArQodC/0L7RgdC+0LEg0YDQsNGB0YfQtdGC0LAg0J3QlNChPVZhdDEK0J3QsNC30LLQsNC90LjQtSDQv9C+0LvRg9GH0LDRgtC10LvRjz3QntCe0J4g0JXQotCaCtCh0YfQtdGCINC/0L7Qu9GD0YfQsNGC0LXQu9GPPTQwNzAyODEwMTAwMDAxNDg4OTY4CtCY0J3QnSDQv9C+0LvRg9GH0LDRgtC10LvRjz02NzMyMDUwMDY0CtCR0LDQvdC6INC/0L7Qu9GD0YfQsNGC0LXQu9GPPdCR0JDQoNCd0JDQo9Cb0KzQodCa0JjQmSDQpNCY0JvQmNCQ0Jsg0J7QkNCeICLQkNCaINCR0JDQoNChIiDQkdCQ0J3QmgrQkdCY0Jog0LHQsNC90LrQsCDQv9C+0LvRg9GH0LDRgtC10LvRjz0wNDAxNzM3MjAK0JrQvtGALiDRgdGH0LXRgiDQsdCw0L3QutCwINC/0L7Qu9GD0YfQsNGC0LXQu9GPPTMwMTAxODEwMTAwMDAwMDAwNzIwCtCd0LDRgdC10LvQtdC90L3Ri9C5INC/0YPQvdC60YIg0LHQsNC90LrQsCDQv9C+0LvRg9GH0LDRgtC10LvRjz3QkdCQ0KDQndCQ0KPQmwrQotC40L8g0L3QsNGB0LXQu9C10L3QvdC+0LPQviDQv9GD0L3QutGC0LAg0LHQsNC90LrQsCDQv9C+0LvRg9GH0LDRgtC10LvRjz3QkwrQmtCf0J8g0L/QvtC70YPRh9Cw0YLQtdC70Y8gKDEwMyk9NjczMjAxMDAxCtCj0L3QuNC60LDQu9GM0L3Ri9C5INC40LTQtdC90YLQuNGE0LjQutCw0YLQvtGAINC/0LvQsNGC0LXQttCwPQrQndCw0LfQstCw0L3QuNC1INC/0LvQsNGC0LXQu9GM0YnQuNC60LA90J7QntCeINCV0KLQmgrQmNCd0J0g0L/Qu9Cw0YLQtdC70YzRidC40LrQsD02NzMyMDUwMDY0CtCR0LDQvdC6INC/0LvQsNGC0LXQu9GM0YnQuNC60LA90JDQniAi0KDQkNCZ0KTQpNCQ0JnQl9CV0J3QkdCQ0J3QmiIK0JHQmNCaINCx0LDQvdC60LAg0L/Qu9Cw0YLQtdC70YzRidC40LrQsD0wNDQ1MjU3MDAK0JrQvtGALiDRgdGH0LXRgiDQsdCw0L3QutCwINC/0LvQsNGC0LXQu9GM0YnQuNC60LA9MzAxMDE4MTAyMDAwMDAwMDA3MDAK0J3QsNGB0LXQu9C10L3QvdGL0Lkg0L/Rg9C90LrRgiDQsdCw0L3QutCwINC/0LvQsNGC0LXQu9GM0YnQuNC60LA90JzQntCh0JrQktCQCtCi0LjQvyDQvdCw0YHQtdC70LXQvdC90L7Qs9C+INC/0YPQvdC60YLQsCDQsdCw0L3QutCwINC/0LvQsNGC0LXQu9GM0YnQuNC60LA90JMK0KHRh9C10YIg0L/Qu9Cw0YLQtdC70YzRidC40LrQsD00MDcwMjgxMDUwMDAwMTQ4ODk2OArQmtCf0J8g0L/Qu9Cw0YLQtdC70YzRidC40LrQsCAoMTAyKT02NzMyMDEwMDEK0J3QtdC+0YLQu9C+0LbQvdC+0YHRgtGMPQrQodGA0L7Rh9C90L7RgdGC0Yw9CtCh0YDQvtGH0L3Ri9C1INC/0LvQsNGC0LXQttC4PQrQndCw0LfQvdCw0YfQtdC90LjQtSDQv9C70LDRgtC10LbQsD3QkiDRgtC+0Lwg0YfQuNGB0LvQtSDQndCU0KEgMTguMDAlIC0gMTUgMjU0LjI0CtCS0LjQtCDQv9C70LDRgtC10LbQsD0K0JrQvtC0INCy0LjQtNCwINC/0LvQsNGC0LXQttCwPTAK0JLQuNC0INC+0L/QtdGA0LDRhtC40Lg9MDEK0JrQkdCaPQrQntCa0KLQnNCePQrQntGB0L3QvtCy0LDQvdC40LUg0L/Qu9Cw0YLQtdC20LA9CtCe0YfQtdGA0LXQtNC90L7RgdGC0Ywg0L/Qu9Cw0YLQtdC20LA9NQrQmtC+0LQg0LLQuNC00LAg0LLQsNC70Y7RgtC90L7QuSDQvtC/0LXRgNCw0YbQuNC4PQrQndCw0LvQvtCz0L7QstGL0Lkg0L/QtdGA0LjQvtC0ICjQtNC10L3RjCk9CtCd0LDQu9C+0LPQvtCy0YvQuSDQv9C10YDQuNC+0LQgKNC80LXRgdGP0YYpPQrQndCw0LvQvtCz0L7QstGL0Lkg0L/QtdGA0LjQvtC0ICjQs9C+0LQpPQrQlNCw0YLQsCDQvdCw0LvQvtCz0L7QstC+0LPQviDQtNC+0LrRg9C80LXQvdGC0LAgKNC00LXQvdGMKT0K0JTQsNGC0LAg0L3QsNC70L7Qs9C+0LLQvtCz0L4g0LTQvtC60YPQvNC10L3RgtCwICjQvNC10YHRj9GGKT0K0JTQsNGC0LAg0L3QsNC70L7Qs9C+0LLQvtCz0L4g0LTQvtC60YPQvNC10L3RgtCwICjQs9C+0LQpPQrQotC40L8g0L3QsNC70L7Qs9C+0LLQvtCz0L4g0L/Qu9Cw0YLQtdC20LA9CtCd0L7QvNC10YAg0L3QsNC70L7Qs9C+0LLQvtCz0L4g0LTQvtC60YPQvNC10L3RgtCwPQo=",
         "time":""
      }
   ],
   "cert":{  
      "keyRef":"lr-50e5f0d0-01e0-4bc1-a8d3-a61380a1075d",
      "content":"\r\nMIIEfTCCBCygAwIBAgIKTcsXzAABAAASfTAIBgYqhQMCAgMwgYsxHzAdBgkqhkiG\r\n9w0BCQEWEGNhQHJhaWZmZWlzZW4ucnUxCzAJBgNVBAYTAlJVMQ8wDQYDVQQHEwZN\r\nb3Njb3cxFzAVBgNVBAoTDlJhaWZmZWlzZW5iYW5rMQwwCgYDVQQLEwNJU0QxIzAh\r\nBgNVBAMTGlJhaWZmZWlzZW5iYW5rIFRlc3QgU3ViIENBMB4XDTE2MDMyNTE1NDIw\r\nMFoXDTE3MDYyNTE1NTIwMFowgdkxGTAXBgkqhkiG9w0BCQEWCmUxQG1haWwucnUx\r\nCzAJBgNVBAYTAlJVMREwDwYDVQQHDAjQntC80YHQujEzMDEGA1UECgwqNjczMjA1\r\nMDA2NCAo0JjQndCdINC+0YDQs9Cw0L3QuNC30LDRhtC40LgpMUEwPwYDVQQLDDjQ\r\nntC/0LXRgNCw0YbQuNC+0L3QvdGL0Lkg0L7RhNC40YEgItCh0LzQvtC70LXQvdGB\r\n0LrQuNC5IjEkMCIGA1UEAwwb0JzQsNGB0L7RgNC+0LLQsCDQntC70LXRgdGPMGMw\r\nHAYGKoUDAgITMBIGByqFAwICJAAGByqFAwICHgEDQwAEQJkPMVvG5nsxUuK1414I\r\nb9Cc+GMLeWYKzvewUCpwpGq/0dU/+9ZGmDS1YfxgHv7b20xgDd6ti5vwrpZ1fMN/\r\nmZ+jggIeMIICGjASBgNVHSUECzAJBgcqhQMCAiIGMB0GA1UdDgQWBBQ8SdR2kkLd\r\nFiQj+vJSC3ayzQqsRzCBkAYDVR0jBIGIMIGFgBRBn2Nl7ObQXCZ/Bc3O1lOqo6EM\r\niKFhpF8wXTELMAkGA1UEBhMCUlUxDzANBgNVBAcTBk1vc2NvdzEXMBUGA1UEChMO\r\nUmFpZmZlaXNlbmJhbmsxJDAiBgNVBAMTG1JhaWZmZWlzZW5iYW5rIFRlc3QgUm9v\r\ndCBDQYIKUZkj+gAAAAAABzCBtwYDVR0fBIGvMIGsMFWgU6BRhk9odHRwOi8vcmF0\r\nZXN0LnJhaWZmZWlzZW4ucnUvcmEvY2RwLzQxOWY2MzY1ZWNlNmQwNWMyNjdmMDVj\r\nZGNlZDY1M2FhYTNhMTBjODguY3JsMFOgUaBPhk1odHRwOi8vcGtpLnJhaWZmZWlz\r\nZW4ucnUvcGtpL2NkcC80MTlmNjM2NWVjZTZkMDVjMjY3ZjA1Y2RjZWQ2NTNhYWEz\r\nYTEwYzg4LmNybDBrBggrBgEFBQcBAQRfMF0wWwYIKwYBBQUHMAKGT2h0dHA6Ly9y\r\nYXRlc3QucmFpZmZlaXNlbi5ydS9yYS9haWEvNDE5ZjYzNjVlY2U2ZDA1YzI2N2Yw\r\nNWNkY2VkNjUzYWFhM2ExMGM4OC5jcnQwKwYDVR0QBCQwIoAPMjAxNjAzMjUxNTQy\r\nMDBagQ8yMDE3MDYyNTE1NDIwMFowCAYGKoUDAgIDA0EAiFAaUZLqp4F1P9HI+fCd\r\nGSU3XJTkbiXUlpBLuCuDtF0DumyTeLXL5h1jtHG2NMhndAzKzlkViJcBzDzrU41x\r\nPQ==\r\n\r\n"
   }
}
```

Где `cert -> keyRef` - информация о ключе и пути до него на машине пользовател или токене,
`digests -> digest` - данные которые необходимо подписать и отправить обратно на сервер.
`cert -> content` - это сертификат (открытый ключ) в формате Base64


### [Настройка сбора логов](https://www.cryptopro.ru/forum2/default.aspx?g=posts&t=4577)
### [программ debugview](https://docs.microsoft.com/en-us/sysinternals/downloads/debugview)


### CLI 
* /opt/cprocsp/sbin/cpconfig --help 
* /opt/cprocsp/sbin/cpconfig -license -view
* sudo /opt/cprocsp/sbin/cpconfig -license -set <серийный_номер>

### Список закрытых ключей /opt/cprocsp/bin/
    ./csptest -keyset -enum_cont -verifycontext -fqcn

### Перечисление контейнеров компьютера: /opt/cprocsp/bin/
    ./csptest -keyset -enum_cont -verifycontext -fqcn -machinekeys

### Ссылка на cadesplugin_api
    https://www.cryptopro.ru/sites/default/files/products/cades/cadesplugin_api.js

