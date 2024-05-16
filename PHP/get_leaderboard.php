<?php
// <!-- connect.php -->
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'connect.php'; // Include your connection script

// Fetch all scores to calculate ranks
// $sql = "SELECT nickname, score FROM game_data ORDER BY score DESC";
$sql = "SELECT nickname, score, total_time FROM game_data ORDER BY score DESC, total_time ASC";

$result = $conn->query($sql);

$leaderboardData = [];
$rank = 1;

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $row['rank'] = $rank++;
        $leaderboardData[] = $row;
    }
}

// Return as JSON
echo json_encode($leaderboardData);

$conn->close();
?>
