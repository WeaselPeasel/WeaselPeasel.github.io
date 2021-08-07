<?php
	error_reporting(E_ALL);
	ini_set("log_errors", 1);
	ini_set("error_log", "php-errors.log");
	
	header('Content-Type: application/json');

	//Initialize important vars
	$aResult = array();
	$aResult['mylog'] = array();
	$logindex = 0;
	$aResult['mylog'][$logindex] = "is this thing on?";
	$logindex++;

	//Go through error checks (debugging only, hopefully)
	if( !isset($_POST['functionname']) ) { 
		$aResult['error'] = 'No function name!'; 
	}

	if ( !isset($_POST['error'])){
		switch ($_POST['functionname']){
			case 'set_vals':
				if (!isset($_POST['arguments'])) {
					$aResult['error'] = "No arguments sent to function 'set_vals'";
				} else {
					$row_num = $_POST['arguments'][0];
					$col_num = $_POST['arguments'][1];
					$bool_array = $_POST['bool_array'];
					// $aResult['basicvalues'] = $bool_array[0];
					if (!isset($bool_array)){
						$aResult['error'][0] = "boolarray is not set";
						if (!isset($row_num) or !isset($col_num)){
							$aResult['error'][1] = "a number is not set";
						}
					} else {
						$aResult['mylog'][$logindex] = "about to call set_vals";
						$logindex++;
						set_vals($bool_array, $row_num, $col_num);
						$obj = json_encode($aResult);
						$aResult['mylog'][$logindex] = "set_vals called. aResult = $obj";
						$logindex++;
					}
				}
				break;
			case 'trigger_nuke':
				trigger_nuke();
				break;
			default:
				$aResult['error'] = 'Not found function: '. $_POST['functionname'].'!';
				break;
		}
	} 
//----------------------------------------------
	function set_vals($arr, $rows, $cols){
		global $aResult, $logindex;
		$aResult['mylog'][$logindex] = "made it to set_vals";
		$logindex++;
		$size = $cols * $rows;
		//insert counts into this array
		$retarr = array();
		$sub_array = array();
		for ($i = 0; $i < $rows; $i++){
			for ($j = 0; $j < $cols; $j++){
				$sub_array[$i] = 0;
			}
			for ($j = 0; $j < $cols; $j++){
				$sub_array[$j] = check_neighbors($i, $j, $rows, $cols, $arr);
			}
			$retarr[$i] = $sub_array;
		}
		$aResult['numarr'] = $retarr;
	}
//---------------------------------------------------------
	function check_neighbors($x, $y, $rows, $cols, $arr){
		global $aResult, $logindex;
		$xPlus = $x + 1;
		$xMinus = $x - 1;
        $yPlus = $y + 1;
		$yMinus = $y - 1;
		$size = 8;
		$coordinates = array(array($xMinus, $yMinus), array($x, $yMinus), array($xPlus, $yMinus), array($xPlus, $y), array($xPlus, $yPlus), array($x, $yPlus), array($xMinus, $yPlus), array($xMinus, $y));
		// Remove coordinates from array if points are off array
        for ($i = 0; $i < $size; $i++){
			if ($coordinates[$i][0] < 0 or $coordinates[$i][0] >= $rows or $coordinates[$i][1] < 0 or $coordinates[$i][1] >= $cols){
				$size = $size - 1;
				unset($coordinates[$i]);
				$aResult['mylog'][$logindex] = "coordinate removed";
				$logindex++;
			}
		}
		$count = 0;
		for ($i = 0; $i < $size; $i++){
			if ($arr[$coordinates[$i][0]][$coordinates[$i][1]] == "true"){
				$count += 1;
			}
		}
		return $count;
	}
//-------------------------------------------
function trigger_nuke() {
	global $aResult;
	$retelement = "<img src='images/nuke.jpeg' style='animation-duration: 2s; animation-name: endgame;' id='deleteme'>";
	$aResult['element'] = $retelement;
}


//Check json encode results
$json = json_encode($aResult);
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
?>
