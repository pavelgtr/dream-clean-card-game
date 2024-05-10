
<?php
$servername = "localhost";
$username = "mrP_cardGame_test"; // replace with your MySQL username, usually 'root' if using XAMPP without setting a password
$password = "mrP_298108!?"; // replace with your MySQL password, usually empty in XAMPP
$dbname = "card_game_data"; // the name of your database

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";
?>



<!-- database user mrP_cardGame_test  -->

<!-- database pass mrP_298108!? -->