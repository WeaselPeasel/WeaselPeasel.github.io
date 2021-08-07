<?php
/*funfotos.php*/
/*Process request*/
$retArray = array();

$post_set = isset($_POST);


if ($post_set){
	/*parse through function options*/
	if ($_POST['function'] == "getimagebyid"){
		$string = getImageById($_POST['imgID'], $_POST['page']);
		$retArray['url'] = $string;
	} elseif ($_POST['function'] == "fetch_images"){
		$date1 = $_POST['date1'];
		$date2 = $_POST['date2'];
		$search_result = $_POST['searchquery'];
		$retArray['img'] = getImageByDate($date1, $date2, $search_result);
	} elseif($_POST['function'] == "drop"){
		$retArray['drop'] = deleteSaves($_POST['deleteSaves']);
        $json = json_encode($retArray);
        echo $json;
	} elseif($_POST['function'] == "storebgcolor"){
		$retArray = storebgcolor($_POST['bgcolor'], $_POST['page']);
		$json = json_encode($retArray);
	} elseif($_POST['function'] == "storeImg"){
		$retArray['returnquery'] = storeImg($_POST['page'], $_POST['cmd']);
		$json = json_encode($retArray);
	} elseif($_POST['function'] == "loadCurrentPage"){
		$retArray = loadCurrentPage($_POST['page']);
		$json = json_encode($retArray);
	} elseif($_POST['function'] == "dropCurrentPage"){
		dropCurrentPage($_POST['page']);
		$json = json_encode($retArray);
	} else {
		$retArray['error'] = "ERROR: function is undefined";
	}

	$json = json_encode($retArray);
	if ($json === false) {
	    // Avoid echo of empty string (which is invalid JSON), and
	    // JSONify the error message instead:
	    $json = json_encode(array("jsonError", json_last_error_msg()));
	    if ($json === false) {
	        // This should not happen, but we go all the way now:
	        $json = '{"jsonError": "unknown"}';
	    }
	    // Set HTTP response status code to: 500 - Internal Server Error
	    http_response_code(500);
	}
	echo $json;
}



function getImageById($imgID, $page){
	/*Image Fetching
	get image id from front end, return image from back end
	query by id*/
	require_once "login.php";
	$conn = new mysqli($hostname, $username, $password, $database);
	$myquery = "SELECT * FROM  funTable WHERE imgID = " . $imgID . ";";
	$result = $conn->query($myquery);
	$result->data_seek(0);
	$row = $result->fetch_array(MYSQLI_ASSOC);
	$myquery = "INSERT INTO funDisplay VALUES(" . $page . ", \"<div style='flex:1'><img src='" . $row['url'] . "' class='imgFinal'></div>\")";
	$result = $conn->query($myquery);
	return "<div style='flex:1'><img src='" . $row['url'] . "' class='imgFinal'></div>";
	
}

function getImageByDate($date1, $date2, $search_result){
	require_once "login.php";
	global $retArray;
	$result_array = array();
	$conn = new mysqli($hostname, $username, $password, $database);
	if ($conn->connect_error){
		$retArray['error'] = "CONNECTION ERROR";
		return $conn->connect_error;
	} else {
		$retArray['error'] = "Success";
	}
	if ((!$date1 or !$date2) and $search_result){
		$myquery = "SELECT * FROM funTable WHERE funTable.description LIKE '%$search_result%'";
	} elseif (!$search_result and ($date1 and $date2)){
		$myquery = "SELECT * FROM funTable WHERE funTable.date BETWEEN '$date1' AND '$date2'";
	} elseif ($search_result and ($date1 and $date2)){
		$myquery = "SELECT * FROM funTable WHERE funTable.date BETWEEN '$date1' AND '$date2'";
	} else {
		$myquery = "SELECT * FROM funTable";
	}
	$result = $conn->query($myquery);
	if (!$result){
		$retArray['error'] = "query returned empty set";
		return $myquery;
	} else {
		for ($i = 0; $i < $result->num_rows; $i++){
			$result->data_seek($i);
			$row = $result->fetch_array(MYSQLI_ASSOC);
			$result_array[$i] = "<img src='".$row['url']."' class='imgDisp' value='".$row['imgID']."'>";
		}
	}
	return $result_array;
}

//Andrew's Section
function deleteSaves($var){
	$conn = new mysqli('localhost', 'asamost', '8734', 'asamost');
	$myquery = "DELETE FROM funDisplay";
	$result = $conn->query($myquery);
	$myquery = "DELETE FROM pages";
	$result = $conn->query($myquery);
	return $var;
}

function storebgcolor($color, $pageNum){
	$conn = new mysqli('localhost', 'asamost', '8734', 'asamost');
	$myquery = "DELETE FROM pages WHERE page = " . $pageNum;
	$result = $conn->query($myquery);
	$myquery = "INSERT INTO pages VALUES(" . $pageNum . ", '" . $color . "', 3);";
	$result = $conn->query($myquery);
	if (!result){
		$output = "Failed";
	}
	else {
		$output = "Success";
	}
	$array['bgcolorquery'] = $myquery;
	$array['outputbg'] = $output;
	return $array;
}

function loadCurrentPage($page){
	$conn = new mysqli('localhost', 'asamost', '8734', 'asamost');
	$myquery = "SELECT bgcolor FROM pages WHERE page = " . $page;
	$result = $conn->query($myquery);
	$result->data_seek(0);
	$row = $result->fetch_array(MYSQLI_ASSOC);
	$array['bgcolor'] = $row['bgcolor'];
	$myquery = "SELECT cmd FROM funDisplay WHERE page = " . $page;
	$result = $conn->query($myquery);
	for ($i = 0; $i < $result->num_rows; $i++){
		$result->data_seek($i);
		$row = $result->fetch_array(MYSQLI_ASSOC);
		$array["a" . $i] = $row['cmd'];
	}
	return $array;	
}

function dropCurrentPage ($page) {
	$conn = new mysqli('localhost', 'asamost', '8734', 'asamost');
	$myquery = "DELETE FROM pages WHERE page = " . $page;
	$result = $conn->query($myquery);
	$myquery = "DELETE FROM funDisplay WHERE page = " . $page;
	$result = $conn->query($myquery);
}

?>