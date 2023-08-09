const db = require('../config/config');
const bcrypt = require('bcryptjs');

const User = {};

User.getAll= () => {
    const sql = `
    SELECT 
        *
    FROM
        users
        `;

    return db.manyOrNone(sql);
}

User.create = async (user) => {

    const hash = await bcrypt.hash(user.password, 10);
    const sql = `
    INSERT INTO
        users(
            email,
            name,
            lastname,
            dni,
            phone,
            image,
            password,
            created_at,
            updated_at
        )
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id
    `;
    return db.oneOrNone(sql,[
        user.email,
        user.name,
        user.lastname,
        user.dni,
        user.phone,
        user.image,
        hash,
        new Date(),
        new Date
    ])
}

User.getAdminsNotificationsTokens = () => {
    const sql = `
    SELECT 
        U.notification_token
    FROM 
        users AS U
    INNER JOIN
        user_has_roles AS UHR
    ON
        UHR.id_user = U.id
    INNER JOIN
        roles as R
    ON
        R.id = UHR.id_rol
    WHERE
        R.id = 2
    `;
    return db.manyOrNone(sql);
}

User.getNotificationTokenById = (id_user) => {
    const sql = `
    SELECT 
        U.notification_token,
        U.name,
        U.lastname
    FROM 
        users AS U
    INNER JOIN
        user_has_roles AS UHR
    ON
        UHR.id_user = U.id
    INNER JOIN
        roles as R
    ON
        R.id = UHR.id_rol
    WHERE
        U.id = $1
    GROUP BY
		U.id
    `;
    return db.oneOrNone(sql,id_user);
}

User.findByDeliveryMen = () => {
    const sql = `
    SELECT 
    U.id,
    U.email,
    U.name,
    U.lastname,
    U.dni,
    U.image,
    U.phone,
    U.password,
    U.session_token
FROM 
    users AS U
INNER JOIN
    user_has_roles AS UHR
ON
    UHR.id_user = U.id
INNER JOIN
    roles as R
ON
    R.id = UHR.id_rol
WHERE
    R.id = 3
    `;
    return db.manyOrNone(sql);
}

User.findByEmail = (email) => {
    const sql = `
    SELECT 
        U.id,
        U.email,
        U.name,
        U.lastname,
        U.dni,
        U.image,
        U.phone,
        U.password,
        U.session_token,
		json_agg(
			json_build_object(
				'id', R.id,
				'name', R.name,
				'image', R.image,
				'route', R.route
			)
		) AS roles
    FROM 
        users AS U
	INNER JOIN
		user_has_roles AS UHR
	ON
		UHR.id_user = U.id
	INNER JOIN
		roles as R
	ON
		R.id = UHR.id_rol
    WHERE
        U.email = $1
		
	GROUP BY
		U.id
    `;
    return db.oneOrNone(sql,email);
}

User.findById = (id,callback) => {
    const sql = `
        SELECT 
            id,
            email,
            name,
            dni,
            lastname,
            image,
            phone,
            password,
            session_token
        FROM 
            users
        WHERE
            id = $1
            `;
    return db.oneOrNone(sql, id).then(user => {callback(null, user) })
}

User.update = (user) => {
    const sql = `
    UPDATE 
        users
    SET
        name = $2,
        lastname = $3,
        phone = $4,
        image = $5,
        updated_at = $6
    WHERE
	    id = $1
    `;
    return db.none(sql, [
        user.id,
        user.name,
        user.lastname,
        user.phone,
        user.image,
        new Date()
    ]);
};


User.updateSessionToken = (id_user,session_token) => {
    const sql = `
    UPDATE 
        users
    SET
        session_token= $2
    WHERE
	    id = $1
    `;
    return db.none(sql, [
        id_user,
        session_token
    ]);
};

User.updateNotificationToken = (id_user,notification_token) => {
    const sql = `
    UPDATE 
        users
    SET
        notification_token= $2
    WHERE
	    id = $1
    `;
    return db.none(sql, [
        id_user,
        notification_token
    ]);
}

module.exports = User;