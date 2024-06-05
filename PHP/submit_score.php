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

    // Check if the player's score already exists in the database
    $query = "SELECT score FROM game_data WHERE nickname = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $nickname);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $existingScore = $row['score'];

        // Update the score only if the submitted score is higher
        if ($score > $existingScore) {
            $updateQuery = "UPDATE game_data SET score = ?, game_level = ?, total_time = ? WHERE nickname = ?";
            $updateStmt = $conn->prepare($updateQuery);
            $updateStmt->bind_param("iiss", $score, $game_level, $total_time, $nickname);
            
            if ($updateStmt->execute()) {
                echo "Score updated successfully";
            } else {
                echo "Error updating score: " . $updateStmt->error;
            }
            
            $updateStmt->close();
        } else {
            echo "Submitted score is not higher than the existing score";
        }
    } else {
        // Insert a new record if the player's score doesn't exist
        $insertQuery = "INSERT INTO game_data (nickname, email, score, game_level, total_time) VALUES (?, ?, ?, ?, ?)";
        $insertStmt = $conn->prepare($insertQuery);
        $insertStmt->bind_param("ssiii", $nickname, $email, $score, $game_level, $total_time);
        
        if ($insertStmt->execute()) {
            echo "New record created successfully";
        } else {
            echo "Error: " . $insertStmt->error;
        }
        
        $insertStmt->close();
    }

    $stmt->close();
    $conn->close();
}
?>