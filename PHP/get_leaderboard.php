<?php


error_reporting(E_ALL);
ini_set('display_errors', 1); 


include 'connect.php'; // Include your connection script

// Get the top scores (e.g., top 10)
$sql = "SELECT nickname, score FROM game_data ORDER BY score DESC LIMIT 10";
$result = $conn->query($sql);

$leaderboardData = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $leaderboardData[] = $row;
    }
}

// Return as JSON
echo json_encode($leaderboardData);

$conn->close(); 
?>
