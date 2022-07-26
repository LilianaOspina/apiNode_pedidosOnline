<img src="./assets/delilah_resto.png" alt="Delilah Resto">

# API Delilah Restó!

API de Pedidos Online - Proyecto Acámica

## **Tecnologías aplicadas**

✅ JavaScript

✅ SQL

✅ Git

## **Descripción del proyecto**

Esta API funciona como un sistema de pedidos online, en la que administradores y usuarios pueden acceder a distintas funcionalidades como:

✅ Crear usuarios

✅ Agregar productos, editarlos o eliminarlos.

✅ Crear órdenes de pedidos, modificarlas o eliminarlas.

**Dependencias:**
Usamos las siguientes dependencias para el correcto funcionamiento del sistema

|DEPENDENCIA       |VERSIÓN      |FUNCIÓN                         |
|----------------|------------|-----------------------------|
|express|`4.17.1` |Creación del servidor back-end en JavaScript            |
|jsonwebtoken |`8.5.1`  |Autenticación de usuarios            |
|mysql2 |`2.1.0`|Base de datos|


## Preparación de entorno:

**Instalar:** 
- Node.js 
- MySQL
- Postman/Insomnia (importa el archivo **api_delilah_resto.json**)

**Corremos los programas:**
````
    git clone https://github.com/LilianaOspina/api_delilah_resto.git
    cd api_delilah_resto
    npm i
    npm run migrations
    npm run start-dev

````

## Endpoints

- **[GET] /user/:id?token=...**
    > Usuarios con rol de ADMIN pueden consultar datos de otros usuarios por ID, usuarios con rol USER solo pueden ver sus propios datos.

    **Request:**
    ```
        http://localhost:4444/user/2?token=eyJhbGciOiJIUzI1NiIsIn...

    ```
    **Response:**
    ```json
    [
        {
            "ID": 2,
            "USER_NAME": "tom14",
            "FULL_NAME": "Tom Ospina",
            "EMAIL": "orejasdetom@gmail.com",
            "PHONE_COUNTRY_CODE": 54,
            "PHONE_NUMBER": 1161587190,
            "ADDRESS": "bariloche",
            "USER_PASSWORD": "tomcitoloco",
            "USER_ROLE": "USER"
        }
    ]
	```
- **[GET] /user/:id?token=...**
    > Usuarios con rol de ADMIN pueden consultar listado de datos de otros usuarios, usuarios con rol USER solo pueden ver sus propios datos.

    **Request:**
    ```
        http://localhost:4444/user/2?token=eyJhbGciOiJIUzI1NiIsIn...

    ```
    **Response:**
    ```json
    [
        {
            "ID": 2,
            "USER_NAME": "tom14",
            "FULL_NAME": "Tom Ospina",
            "EMAIL": "orejasdetom@gmail.com",
            "PHONE_COUNTRY_CODE": 54,
            "PHONE_NUMBER": 1161587190,
            "ADDRESS": "bariloche",
            "USER_PASSWORD": "tomcitoloco",
            "USER_ROLE": "USER"
        }
    ]
	```
- **[POST] /user/login**
    > Se ingresa al sitio con los datos de inscripción necesarios y devuelve un token que usaremos cuando lo requiera la API, esto nos dará los accesos pertinentes.

    **Request:**
    ```json
    {
        "USER_NAME": "tom14",
        "EMAIL": "orejasdetom@gmail.com",
        "USER_PASSWORD": "tomcitoloco"
    }
    ```
    **Response**
    ```json
    {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
- **[POST] /user/add**
    > Se crean los usuarios con rol de usuario o administrador (USER / ADMIN).

    **Request:**
    ```json
    {
        "USER_NAME": "t0m",
        "FULL_NAME": "Tom Snow",
        "EMAIL": "orejasdetom@gmail.com",
        "PHONE_COUNTRY_CODE": 54,
        "PHONE_NUMBER": 1160587199,
        "ADDRESS": "bariloche",
        "USER_PASSWORD": "tomcitoloco02",
        "USER_ROLE": "ADMIN"
    }
    ````
    **Response:**
    ````json
    {
        "fieldCount": 0,
        "affectedRows": 1,
        "insertId": 3,
        "info": "",
        "serverStatus": 2,
        "warningStatus": 
    }
	```

- **[GET] /products**
    > Usuarios y administradores pueden listar los productos.

    **Response:**
    ```json
    [
        {
            "ID": 4,
            "PRODUCT_NAME": "bacon sandwich",
            "PRICE": 680,
            "IMAGE": "https://bacon-sandwich.jpg"
        },
        {
            "ID": 5,
            "PRODUCT_NAME": "sandwich beef",
            "PRICE": 950,
            "IMAGE": "https://sandwich-beef.jpg"
        },
    ]
    ```` 
- **[POST] /products**
    > El usuario con rol de ADMIN puede agregar productos.

    **Request:**
    ```json
    {
        "PRODUCT_NAME": "tuna sandwich", 
        "PRICE": 350, 
        "IMAGE": "https://tuna-sandwich.jpg",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
    **Response:**
    ```json
    {
        "fieldCount": 0,
        "affectedRows": 1,
        "insertId": 11,
        "info": "",
        "serverStatus": 2,
        "warningStatus": 0
    }
    ```     
- **[PUT] /products**
    > Usuarios con rol de ADMIN pueden modificar los productos.

    **Request:**
	```json
    {
        "ID": 9,
        "PRODUCT_NAME": "bacon burguer",
        "PRICE": 910,
        "IMAGE": "https://bacon-burguer.jpg",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp..."
    }
	```
	**Response:**
    ```json	
	{
        "fieldCount": 0,
        "affectedRows": 1,
        "insertId": 0,
        "info": "Rows matched: 1  Changed: 0  Warnings: 0",
        "serverStatus": 2,
        "warningStatus": 0,
        "changedRows": 0
	}	  
    ```	
- **[DELETE] /products/:id**
    > Usuarios con rol de ADMIN pueden eliminar productos.

    **Request:**
    ```
        http://localhost:4444/products/13

    ```
    ```json
    {
		"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp..."
    }
    ```
    **Response:**
    ```json
    {
        "fieldCount": 0,
        "affectedRows": 1,
        "insertId": 0,
        "info": "",
        "serverStatus": 2,
        "warningStatus": 0
    }
    ```

- **[GET] /order?token=...**
    > Usuarios con rol de USER podrán listar sus pedidos, usuarios con rol de ADMIN listarán todos los pedidos de todos los usuarios.
    > Se asume que si el USER llama a la api, se busca mostrar el detalle de todas sus órdenes en pantalla para su visualización por esta razón no se agrupa el detalle de productos por orden.
    > Si es ADMIN, se agrupan los productos de cada orden para que todo quede en una sola fila por orden.

    **Request:**
    ```
        http://localhost:4444/order?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC...

    ```
    **Response:**
    ```json
    [
        {
            "id_order": 41,
            "payment_date": "0:28",
            "order_status": "NUEVO",
            "payment": "EFECTIVO",
            "full_name": "Liliana Ospina",
            "address": "bariloche",
            "descripcion": "3x bacon sandwich",
            "total": 2040
        },
        {
            "id_order": 46,
            "payment_date": "21:56",
            "order_status": "NUEVO",
            "payment": "EFECTIVO",
            "full_name": "Tom Ospina",
            "address": "bariloche",
            "descripcion": "10x classic burguer, 10x bacon burguer",
            "total": 14800
        }
    ]
    ```
- **[POST] /order**
    > Usuarios y administradores pueden crear pedidos.

    **Request:**
    ```json
    {
        "FORMADEPAGO": "EFECTIVO",
        "PRODUCTOS": {
            "6" : {
                "CANTIDAD" : 10
            },
            "9" : {
                "CANTIDAD" : 10
            }
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6I..."
    }
    ```
    **Response:**
    ```json
    {
        "fieldCount": 0,
        "affectedRows": 1,
        "insertId": 46,
        "info": "",
        "serverStatus": 2,
        "warningStatus": 0
    }
    ```
- **[PUT] /order**
    > Usuarios con rol de ADMIN podrán modificar ordenes.

    **Request:**
    ```json
    {
        "ID_ORDEN": 44,
        "FORMADEPAGO": "EFECTIVO",
        "PRODUCTOS": {
            "5" : {
                "CANTIDAD" : 10
            },
            "9" : {
                "CANTIDAD" : 15
            }
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cC..."
    }
    ```
    **Response:**
    ```json
    {
        "fieldCount": 0,
        "affectedRows": 1,
        "insertId": 0,
        "info": "Rows matched: 1  Changed: 0  Warnings: 0",
        "serverStatus": 2,
        "warningStatus": 0,
        "changedRows": 0
    }
    ```
- **[PUT] /order/status**
    > Usuarios con rol de ADMIN podrán modificar el estado de los pedidos.

    **Request:**
    ```json
    {
        "ESTADO" : "CONFIRMADO",
        "ID_ORDEN" : 44,
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI..."
    }    
    ```
    **Response:**
    ```json
    {
        "fieldCount": 0,
        "affectedRows": 1,
        "insertId": 0,
        "info": "Rows matched: 1  Changed: 1  Warnings: 0",
        "serverStatus": 2,
        "warningStatus": 0,
        "changedRows": 1
    }
    ```
- **[DELETE] /order**
    > Usuarios con rol de ADMIN podrán eliminar pedidos.

    **Request:**
    ```json
    {
        "ID": 43,
        "token": "eyJhbGciOiJIUzI1NiIsInR5..."
    }
    ```
    **Response:**
    ```json
    {
        "fieldCount": 0,
        "affectedRows": 2,
        "insertId": 0,
        "info": "",
        "serverStatus": 34,
        "warningStatus": 0
    }
    ```













