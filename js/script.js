$(function(){

    function initialYMD(element) {
      var weeks = new Array("日","月","火","水","木","金","土");
      var today = new Date();

      $(element).prepend('<select class="monthandday"></select>');
      for(var i=-10; i<=40; i++){
        var day = compDate(today.getFullYear(), today.getMonth(), today.getDate(), i);
        var y = day.getFullYear();
        var m = day.getMonth()+1;
        var d = day.getDate();
        var w = weeks[day.getDay()];
        if(i == 0) {
          $(element+' select.monthandday').append(
            '<option value="' +y+'/'+m+'/'+d + '">今日</option>'
          );
        } else {
          $(element+' select.monthandday').append(
            '<option value="' + y+'/'+m+'/'+d + '">' + m +'月'+ d +'日 ('+ w +')</option>'
          );
        }
      }
    }

    function compDate(year, month, day, addDays){
      var dt = new Date(year, month, day);
      var baseSec = dt.getTime();
      var addSec = addDays * 86400000;
      var targetSec = baseSec + addSec;
      dt.setTime(targetSec);
      return dt;
    }

    function setYMD(elem, y, m, d) {
      $(elem+" select").val(y+'/'+m+'/'+d);
    }

    function sche1week(start, end, back, zero, lang, week){
      var str = new String();
      var weeks = new Array("日","月","火","水","木","金","土");
      var day = new Date();
      var period = Math.ceil((end-start)/(24*60*60*1000));

      for(var i=0; i<period+1; i++){
        day = compDate(start.getFullYear(), start.getMonth(), start.getDate(), i);
        var y=day.getFullYear();
        var m=day.getMonth()+1;
        var d=day.getDate();
        var w=weeks[day.getDay()];

        if(week==1 && (w=='土' || w=='日')) { //休日のみ
          continue;
        } else if(week==2 && w!='土' && w!='日') { //平日のみ
          continue;
        }

        if(zero){
          if(m<10) { m = '0' + m; }
          if(d<10) { d = '0'+ d; }
        }
        if(lang=='e') {
          str = str + m+'/'+d+'('+w+')'+ back + '\n';
        } else {
          str = str + m+'月'+d+'日('+w+')'+ back + '\n';
        }
      }
      $("#schedule").val(str);
    }

    var date = new Date();
    var back = '';
    var zero = false;
    var lang = 'e';
    var week = 0; // 0:全日, 1:平日のみ, 2:休日のみ
    var end_ymd_change_flag = false;

    initialYMD('#start_ymd');
    initialYMD('#end_ymd');
    setYMD('#start_ymd', date.getFullYear(), date.getMonth()+1, date.getDate());
    var endday = compDate(date.getFullYear(), date.getMonth(), date.getDate(), 6);
    setYMD('#end_ymd', endday.getFullYear(), endday.getMonth()+1, endday.getDate());

    sche1week(date, endday, back, zero, lang, week);

    // #start_ymd select or #end_ymd selectchange
    $("#start_ymd select").change(function(){
      date = new Date($("#start_ymd select").val());
      if(!end_ymd_change_flag) {
        endday = compDate(date.getFullYear(), date.getMonth(), date.getDate(), 6);
        setYMD('#end_ymd', endday.getFullYear(), endday.getMonth()+1, endday.getDate());
      }
      sche1week(date, endday, back, zero, lang, week);
    });
    $("#end_ymd select").change(function(){
      endday = new Date($("#end_ymd select").val());
      if(!end_ymd_change_flag) { end_ymd_change_flag = true; }
      sche1week(date, endday, back, zero, lang, week);
    });

    // input#backtext change
    $("input#backtext").keyup(function(){
      back = $("#backtext").val();
      if(back=='jazz' || back=='Jazz' || back=='JAZZ'){
        back = '12昼345678';
      }
      sche1week(date, endday, back, zero,lang, week);
    });

    // format change
    $("select#format").change(function(){
      var f=$(this).val();
      switch(f){
        case "1":
        zero=false;
        lang='e';
        break;
        case "2":
        zero=true;
        lang='e';
        break;
        case "3":
        zero=false;
        lang='j';
        break;
        case "4":
        zero=true;
        lang='j';
        break;
        default:
        break;
      }
      sche1week(date, endday, back, zero, lang, week);
    });

    $('input[name="wd"]:radio').change( function(){
      week = $(this).val();
      sche1week(date, endday, back, zero, lang, week);
    });

    $('#schedule').bind('click', function(){
      // $(this).selectionStart;
      sche = document.getElementById('schedule');
      sche.selectionStart = 0;
      sche.selectionEnd = sche.value.length;
    });

  });