<?php
//phpinfo();
?>
<?php
define('QUANTITY', 4);
define('START', 1);
define('FINISH', 50);
$segments = array();
for ($i = 0; $i < QUANTITY; $i++) {
  $s = rand(START, FINISH);
  $f = rand($s, FINISH);
  $segments[] = array(
    'st' => $s,
    'fn' => $f,
    'length' => $f - $s + 1,
  );
}
?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Coverage Problem</title>
        <link href='/css/styles.css' rel='stylesheet' type='text/css'>
    </head>
    <body>
        <div class="table-wrapper">
            <table cellpadding="0" cellspacing="0">
                <thead>
                    <tr>
                        <th class="range-cell">Range</th> 
                        <?php for ($col = START; $col <= FINISH; $col++): ?>
                        <th><?php echo $col; ?></th>
                        <?php endfor; ?>
                    </tr>
                </thead>
                <tbody class="general-table">
                <?php for ($row = 0; $row < QUANTITY; $row++): ?>
                    <tr>
                        <td class="range-cell"><?php echo $segments[$row]['st'] . " - " . $segments[$row]['fn'];?></td>
                        <?php if ($segments[$row]['st'] - START): ?>
                        <td class="emptyness" colspan="<?php echo $segments[$row]['st'] - START; ?>"></td>
                        <?php endif; ?>
                        <td class="segment"
                            colspan="<?php echo $segments[$row]['length']; ?>"
                            data-segment-id="<?php echo $row; ?>"
                            data-segment-st="<?php echo $segments[$row]['st']; ?>"
                            data-segment-fn="<?php echo $segments[$row]['fn']; ?>"
                            data-segment-length="<?php echo $segments[$row]['length']; ?>"
                            title="<?php echo $segments[$row]['length']; ?>"></td>
                        <?php if (FINISH - $segments[$row]['fn']): ?>
                        <td class="emptyness" colspan="<?php echo FINISH - $segments[$row]['fn']; ?>"></td>
                        <?php endif; ?>
                    </tr>
                <?php endfor; ?>
                </tbody>
                <tfoot>
                    <tr>
                        <td class="range-cell"></td>
                        <td colspan="<?php echo FINISH - START + 1; ?>"></td>
                    </tr>
                    <tr id="coverage-row">
                        <td class="range-cell">Coverage</td>
                        <td colspan="<?php echo FINISH - START + 1; ?>"></td>
                    </tr>
                    <tr id="summary-row">
                        <td class="range-cell">Summary</td>
                        <td class="result" colspan="<?php echo FINISH - START + 1; ?>">0</td>
                    </tr>
                </tfoot>
            </table>
        </div>
        <div class="button-wrapper">
            <button>Sort by length UP</button>
            <button>Sort by beginning </button>
            <button>Sort by ending</button>
            <button>Sort by beginning+length</button>
            <button>Sort by ending+length</button>
            <button id="new-gen">Sort by length UP</button>
        </div>
        <!-- Use native javascript -->
        <script type="text/javascript" src="/js/native/lib.js"></script>
        <script type="text/javascript" src="/js/native/coverage.js"></script>
        <script type="text/javascript" src="/js/native/main.js"></script>
        <!-- Use jQuery -->
<!--        <script type="text/javascript" src="/js/jquery/jquery.min.js"></script>
        <script type="text/javascript" src="/js/jquerty/main.js"></script>-->
    </body>
</html>
