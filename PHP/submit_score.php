<?php
// <!-- submit_score.php -->
include 'connect.php'; // Include your connection script

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nickname = $_POST['nickname'];
    $email = $_POST['email'];
    $score = $_POST['score'];
    $game_level = $_POST['game_level'];
    $total_time = $_POST['total_time'];

    // Debugging output
    error_log("Nickname: $nickname, Email: $email, Score: $score, Game Level: $game_level, Total Time: $total_time");
    // Prepare and bind
    $stmt = $conn->prepare("INSERT INTO card_game_data.game_data (nickname, email, score, game_level, total_time) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("ssiii", $nickname, $email, $score, $game_level, $total_time);

    if ($stmt->execute()) {
        echo "New record created successfully";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>