# node_crud_api

## Команды:

1. npm run start:dev - запускает скрипт в режиме разработки.
2. npm run start:prod - собирает продакшн файл и запускает сервер.
3. npm run start:multi - собирает продакшн файл с кластером и запускает сервер.
4. npm run test - запускает скрипты(для работы нужен запущенный сервер в отдельной вкладке терминала).

## Информация:

- http://localhost:3000/ - урл сервера.
- для получения всех юзеров **api/users/** или **api/users** оба варианта валидные.
- Метод PUT для конкретного юзера принимает все поля (username, age, hobbies). **Все поля обязательные**. Можно передать те же данные.
- Для проверки 500 ошибки сервера в файле scr/database/database.ts в методах добавляйте throw new Error('').
- Если в объект для обновления или создания юзера передать лишние поля они будут игнорироваться.

## Тесты:

- путь test/test.ts.
- В 1 файле 3 сценария.
- В тестах использую другой порт 3030, т.к. если использовать порт из .env 3000 появляется предупреждение, что порт занят, в связи с этим, чтобы не показывалось предупреждение поменял для тестов порт. Для проверки можете в строке 22 убрать 3030 ||, оставив process.env.PORT.
