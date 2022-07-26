const express = require("express");
const mysql = require("mysql2");

const app = express();
app.use(express.json());

const jsonWebToken = require("jsonwebtoken");
const { json } = require("express");
const myJWTSecretKey = "a61twg283e328das";
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "delilah",
});

const tokenVerify = (req, res, next) => {
    let token;

    if (req.route.methods.get) {
        token = req.query.token;
    } else {
        token = req.body.token;
    }
    try {
        const tokenDecodedData = jsonWebToken.verify(token, myJWTSecretKey);
        const { ID, 
                USER_ROLE 
        } = tokenDecodedData;
        req.USER_DATA = {
            ID,
            USER_ROLE,
        };
        next();
    } catch {
        res.json({ error: "token invalido" });
    }
};
const isAdminUser = (req, res, next) => {
    if (req.USER_DATA.USER_ROLE === "ADMIN") {
        next();
    } else {
        res.json({ error: "El usuario no es admin" });
    }
};

app.get("/user/:id", tokenVerify, (req, res) => {
    let userId = (req.USER_DATA.USER_ROLE === "ADMIN" ? req.params.id : req.USER_DATA.ID);

    connection.query(`SELECT * FROM users WHERE ID=${userId}`, (err, results, fields) => {
            res.json(results);
        }
    );
});
app.get("/user", tokenVerify, (req, res) => {
    let condition = (req.USER_DATA.USER_ROLE === "ADMIN" ? '' : ` WHERE ID=${req.USER_DATA.ID}`);

    connection.query(`SELECT * FROM users` + condition, (err, results, fields) => {
            res.json(results);
        }
    );
});
app.post("/user/login", (req, res) => {
    const { USER_NAME, 
            EMAIL, 
            USER_PASSWORD 
    } = req.body;

    let stringCondition = "";
    const conditionsName = ["USER_NAME", 
                            "EMAIL", 
                            "USER_PASSWORD"
    ];
    const conditionsValue = [USER_NAME, 
                             EMAIL, 
                             USER_PASSWORD
    ];

    conditionsValue.forEach((condition, index) => {
    
        if (condition !== undefined) {
            if (stringCondition === "") {
                stringCondition = "WHERE " + conditionsName[index] + " = '" + conditionsValue[index] + "'";
            } else {
                stringCondition = stringCondition + " AND " + conditionsName[index] + " = '" + conditionsValue[index] + "'";
            }
        }
    });

    if ((USER_NAME && USER_PASSWORD) || (EMAIL && USER_PASSWORD)) {
        const queryString = "SELECT * FROM users " + stringCondition;

        connection.query(queryString, (err, results, fields) => {
            const { ID, 
                    USER_NAME, 
                    EMAIL, 
                    USER_ROLE 
            } = results[0];

            const payload = { ID, 
                              USER_NAME, 
                              EMAIL, 
                              USER_ROLE 
            };

            const token = jsonWebToken.sign(payload, myJWTSecretKey);

            res.json({ token });
        });
    } else {
        res.status(401);
        res.json({
            error: "Username O Password inexistente",
        });
    }
});
app.post("/user/add", (req, res) => {
    const { USER_NAME, 
            FULL_NAME, 
            EMAIL, 
            PHONE_COUNTRY_CODE, 
            PHONE_NUMBER, 
            ADDRESS, 
            USER_PASSWORD, 
            USER_ROLE 
    } = req.body;

    const verifyInputs =
        USER_NAME != undefined &&
        FULL_NAME != undefined &&
        EMAIL != undefined &&
        PHONE_COUNTRY_CODE != undefined &&
        PHONE_NUMBER != undefined &&
        USER_PASSWORD != undefined &&
        USER_ROLE != undefined;

    if (!verifyInputs) {
        res.json({ error: "Hay datos de usuario faltantes!" });
        return;
    }

    connection.query(
        "INSERT INTO `users` (USER_NAME, FULL_NAME, EMAIL, PHONE_COUNTRY_CODE, PHONE_NUMBER, ADDRESS, USER_PASSWORD, USER_ROLE) VALUES ('" +
            USER_NAME +
            "', '" +
            FULL_NAME +
            "', '" +
            EMAIL +
            "', '" +
            PHONE_COUNTRY_CODE +
            "', '" +
            PHONE_NUMBER +
            "', '" +
            ADDRESS +
            "', '" +
            USER_PASSWORD +
            "' , '" +
            USER_ROLE +
            "');",
        function (err, results, fields) {
            res.json(results);
        }
    );
});

app.get("/products", (req, res) => {
    connection.query("SELECT * FROM `products`;", (err, results, fields) => {
            res.json(results);
        }
    );
});
app.post("/products", tokenVerify, isAdminUser, (req, res) => {
    const { PRODUCT_NAME, 
            PRICE, 
            IMAGE
    } = req.body;

    connection.query("INSERT INTO products (PRODUCT_NAME, PRICE, IMAGE) VALUES ('" + 
        PRODUCT_NAME + "', '" + 
        PRICE + "', '" + 
        IMAGE + "');", 
        function (err, results,fields) {
            res.json(results);
        }
    );
});
app.put("/products", tokenVerify, isAdminUser, (req, res) => {
    const { ID, 
        PRODUCT_NAME, 
        PRICE, 
        IMAGE
    } = req.body;

    if (ID === undefined) {
        res.json({ error: "El update deberia tener un ID" });
    }

    let changeString = "";
    const changeRequestName = ["PRODUCT_NAME", 
                               "PRICE", 
                               "IMAGE"
    ];
    const changeRequestValue = [PRODUCT_NAME, 
                                PRICE, 
                                IMAGE
    ];

    changeRequestValue.forEach((condition, index) => {
        if (condition !== undefined) {
            if (changeString === "") {
                changeString = "SET " + changeRequestName[index] + " = '" + changeRequestValue[index] + "'";
            } else {
                changeString = changeString + " , " + changeRequestName[index] + " = '" + changeRequestValue[index] + "'";
            }
        }
    });

    console.log("UPDATE products " + changeString + " WHERE ID=" + ID);
    connection.query("UPDATE products " + 
        changeString + " WHERE ID=" + 
        ID, 
            function (err, results, fields) {
                res.json(results);
            }
    );
});
app.delete("/products/:id", tokenVerify, isAdminUser, (req, res) => {
    const ID = req.params.id;

    if (ID === undefined) {
        res.json({ error: "El remove deberia recibir id" });
    }

    connection.query(`DELETE FROM products WHERE ID=${ID}`, (err, results, fields) => {
            res.json(results);
        }
    );
});

app.get("/order", tokenVerify, (req, res) => {
    let QUERY_USER = `select o.id 'id_order', o.payment_date, o.order_status, o.payment, 
		u.full_name, u.address,
		p.product_name, op.quantity, p.price, op.quantity * p.price 'totalPerproduct'
        from orders o
        inner join orderproducts op on o.id = op.ID_ORDER
        INNER JOIN USERS U ON U.ID = O.ID_USER
        INNER JOIN PRODUCTS P ON P.ID = OP.ID_PRODUCT
        WHERE U.id = ${req.USER_DATA.ID}`;

    let QUERY_ADMIN = `select o.id 'id_order', o.payment_date, o.order_status, o.payment, 
                        u.full_name, u.address, d.descripcion, d.total
                        from orders o
                        INNER JOIN USERS U ON U.ID = O.ID_USER
                        inner join
                        (
                            SELECT id_order, GROUP_CONCAT(CONCAT(op.quantity, 'x ', p.product_name) SEPARATOR ', ') 'descripcion',
                                    sum(op.quantity * p.price) 'total'
                            FROM products p
                            INNER JOIN orderproducts op on p.id = op.id_product
                            GROUP BY id_order
                        ) as d on d.id_order = o.id`;

    connection.query((req.USER_DATA.USER_ROLE == "ADMIN" ? QUERY_ADMIN : QUERY_USER), function (err, results, fields) {
        res.json(results);
    });
});
app.post("/order", tokenVerify, (req, res) => {
    const { FORMADEPAGO, PRODUCTOS } = req.body;

    //validar usuario
    connection.query(`SELECT * FROM users WHERE ID=${req.USER_DATA.ID}`, (err, results, fields) => {
        if (err)
            res.json(err);

        if(results.length !== 1)
            res.json({ error: "El usuario es inválido!" });
    });
     
    //validar productos de la orden
    let stringCondition = '';
    Object.keys(PRODUCTOS).forEach((productId, index) => {
        stringCondition += " " + (index == 0 ? "WHERE" : "OR") + " ID=" + productId;
    });

    connection.query("SELECT id FROM products" + stringCondition, (err, results, fields) => {
        if(results.length !== Object.keys(PRODUCTOS).length)
            res.json({ error: "Alguno de los productos es invalido!" });
    });

    connection.query( "INSERT INTO orders (PAYMENT_DATE, ORDER_STATUS, PAYMENT, ID_USER) VALUES (" +
                        "'" + new Date().getHours() + ":" + new Date().getMinutes() + "', " +
                        "'NUEVO', " +
                        "'" + FORMADEPAGO + "', " +
                        req.USER_DATA.ID + ")", (err, orderResult, fields) => {
        if (err) {
                res.json(err);
        }

        const orderId = orderResult.insertId;
        Object.keys(PRODUCTOS).forEach((productId, index) => {
            connection.query( "INSERT INTO OrderProducts (ID_ORDER, ID_PRODUCT, QUANTITY) VALUES (" +
                orderId + ", " +
                productId + ", " +
                PRODUCTOS[productId].CANTIDAD + ")", (err, results, fields) => {
                if (err) {
                    res.json(err);
                }
            });
        });

        res.json(orderResult);
    });
});
app.put("/order", tokenVerify, isAdminUser, (req, res) => {
    const { ID_ORDEN, 
            FORMADEPAGO, 
            PRODUCTOS 
    } = req.body;

    //validar usuario
    connection.query(`SELECT * FROM users WHERE ID=${req.USER_DATA.ID}` , (err, results, fields) => {
        if (err)
            res.json(err);

        if(results.length !== 1)
            res.json({ error: "El usuario es inválido!" });
    }); 
    
    //validar productos de la orden
    let stringCondition = '';
    Object.keys(PRODUCTOS).forEach((productId, index) => {
        stringCondition += " " + (index == 0 ? "WHERE" : "OR") + " ID=" + productId;
    });

    connection.query("SELECT id FROM products" + stringCondition, (err, results, fields) => {
        if(results.length !== Object.keys(PRODUCTOS).length)
            res.json({ error: "Alguno de los productos es invalido!" });
    });

    connection.query( "UPDATE orders SET PAYMENT = '" + FORMADEPAGO + "' WHERE ID=" + ID_ORDEN, (err, orderResult, fields) => {
        if (err) { 
            res.json(err);
        }

        connection.query("DELETE FROM  OrderProducts WHERE ID_ORDER=" + ID_ORDEN, (err, results, fields) => {
            if (err) {
                res.json(err);
        }
        });

        Object.keys(PRODUCTOS).forEach((productId, index) => {
            connection.query( "INSERT INTO OrderProducts (ID_ORDER, ID_PRODUCT, QUANTITY) VALUES (" +
                ID_ORDEN + ", " +
                productId + ", " +
                PRODUCTOS[productId].CANTIDAD + ")", (err, results, fields) => {
                if (err) {
                    res.json(err);
                }
            });
        });

        res.json(orderResult);
    });
});
app.put("/order/status", tokenVerify, isAdminUser, (req, res) => {
    const { ESTADO, ID_ORDEN } = req.body;

    if (ID_ORDEN === undefined) {
        res.json({ error: "El update deberia tener un ID" });
    } 

    connection.query("UPDATE orders SET ORDER_STATUS='" + ESTADO + "'" + " WHERE ID=" + ID_ORDEN, (err, results, fields) => {
        if (err) {
            console.log(err);
        }
        res.json(results);
    }); 
});
app.delete("/order", tokenVerify, isAdminUser, (req, res) => {
    const { ID } = req.body;

    let QUERY = "DELETE FROM `orders` WHERE ID = " + ID + ";";
    connection.query(QUERY, function (err, results, fields) {
        if (err) {
            console.log(err);
        }
    });

    QUERY = "DELETE FROM `orderproducts` WHERE ID_ORDER = " + ID + ";";
    connection.query(QUERY, function (err, results, fields) {
        if (err) {
            console.log(err);
        }
        res.json(results);
    });
});

app.listen(4444, () => console.log("Server Running..."));
