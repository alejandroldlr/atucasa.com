Proyecto Programción Movil 
atucasa.com
Multiplataforma
------------------------------------------
Framework: Ionic v. 1.0.0
------------------------------------------

video aplicacion: https://youtu.be/sZ29FyWvqH8

------------------------------------------
1. Participantes: 

   Enrique Vargas Flores
   Alejandro López de La Rosa

------------------------------------------
2. Plugins utilizados:

   cordova-plugin-geolocation
   cordova-plugin-whitelist
   cordova-sqlite-storage
   com.ionic.keyboard
   cordova-plugin-console
   cordova-plugin-device
   cordova-plugin-splashscreen

------------------------------------------   
3. Librerias utilizadas:

   firebase
   angularfire
   ngcordova

-------------------------------------------------------------------------------
4. Pasos para la instalación del ambiente de trabajo.

4.1 Instalar SDK de android:
    http://developer.android.com/sdk/index.html

4.2 Instalar Xcode para IOS (si se dispone de equipo Apple): 
    https://developer.apple.com/xcode/

4.3 Instalar GIT: http://git-scm.com
    Establecer las variables de entorno.

4.4 Instalar NodeJS (version 0.10.36 o 0.10.XX): 
    http://nodejs.org/dist/v0.10.36/node-v0.10.36-x86.msi
    Establecer las variables de entorno.

4.4 Editor IDE de preferencia; se recomienda Sublime Text
    http://www.sublimetext.com/2

4.5 Instalar IONIC
    http://ionicframework.com	

    Instalar el CLI: Correr el comando para instalar ionic de forma global
    $ npm install -g cordova ionic

4.6 Copiar codigo atucasa.com

 4.6.1 Copiar la carpeta ./atucasa del DVD al equipo donde ejecutará la aplicación.
 4.6.2 Clonar en git clone http:// atucasa

4.7 Ingresar a la carpeta /atucasa copiada en la computadora o clonada con git.

4.8 Instalar libreria firebase:
    $ npm install firebase --save

4.9 Instalar bower de forma global:
    $ npm install -g bower

4.10 Instalar ngCordova:
     $ bower install ngcordova

4.11 Instalación de plugins:
     $ cordova plugin add cordova-plugin-geolocation
     $ cordova plugin add cordova-plugin-whitelist
     $ cordova plugin add cordova-sqlite-storage
     $ cordova plugin add com.ionic.keyboard
     $ cordova plugin add cordova-plugin-console
     $ cordova plugin add cordova-plugin-device
     $ cordova plugin add cordova-plugin-splashscreen

4.12 Ejecutar los comandos para añadir plataformas comando:
     $ ionic platform add android

     Si se dispone de apple:
     $ ionic platform add ios 

4.13 Construir el proyecto:
     $ ionic build android 

     Si se dispone de apple:
     $ ionic build ios

4.14 Para correr el aplicativo ejecutar :
     $ ionic run android 

     Si se dispone de apple:
     $ ionic run ios

(*) tomar en cuenta para correr en el dispositivo se necesita que el mismo
    este configurado para modo desarrollador.

-------------------------------------------------------------------------------
      