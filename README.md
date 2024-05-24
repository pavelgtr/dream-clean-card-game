Proyecto de Juego de Cartas

Este proyecto de juego de cartas está compuesto por varios archivos clave que manejan la lógica del juego, la interfaz de usuario y la interacción con la base de datos. Los archivos principales incluyen index.html, main.css, flip-script.js, connect.php, get_leaderboard.php, y submit_score.php.

Para acceder y conectar los valores con la base de datos, debe enfocarse en submit_score.php para las variables nickname, email, score, game_level y total_time. Estas variables se recogen y actualizan durante el juego y se envían al servidor a través de solicitudes AJAX en submit_score.php, que inserta estos datos en la base de datos. Además, el archivo get_leaderboard.php recupera las puntuaciones ordenadas para mostrar la tabla de clasificación. La configuración de la base de datos, incluida en connect.php, debe ser correctamente configurada con el nombre de usuario, contraseña y nombre de la base de datos.
