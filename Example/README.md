# React Native App Auth Goodeva Hub
Sebelum menjalankan project, lebih baik kita setup terlebih dahulu project dengan beberapa tahapan sebagai berikut

## Step #1: First configure

```sh
$ yarn add react-native-app-auth
```

Untuk memastikan jalankan command berikut juga

```sh
$ npm install react-native-app-auth --save
```

## Step #2: Repackage project
Sebelumnya harus install paket manager

```sh
$ npm i react-native-rename
```

Lalu kemudian buat rename package seperti berikult

```sh
$ npx react-native-rename@latest "new_name" -b "bundle_identifier"
```