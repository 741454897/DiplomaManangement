var drawXWZ = function(tbody,obj) {
    var html = '';
    html += '<tr>'+
            '<td class="col-md-3" style="text-align: right"><label for="num">证书编号：</label></td>' +
            '<td class="col-md-3" >' +
                '<span class="num">' + obj.num + '</span>' +
            '</td>' +
            '<td class="col-md-3" style="text-align: right"><label for="txtype">证书类别：</label></td>' +
            '<td class="col-md-3">' +
                '<span class="txtype">' + obj.txtype + '</span>' +
            '</td>'+
        '</tr>' +
        '<tr>' +
            '<td class="col-md-3" style="text-align: right"><label for="degree">学　　位：</label></td>'+
                '<td class="col-md-3">'+
                '<span id="degree">' + obj.degree + '</span>'+
                '</td>'+
            '<td class="col-md-3" style="text-align: right"><label for="school">学　　校：</label></td>'+
            '<td class="col-md-3">'+
                '<span class="school">'+obj.school+'</span>'+
            '</td>'+
        '</tr>'+
        '<tr>'+
            '<td class="col-md-3" style="text-align: right"><label for="certdate">发证日期：</label></td>'+
            '<td class="col-md-3">'+
                '<span class="certdate">'+obj.certdate+'</span>'+
            '</td>'+
            '<td class="col-md-3" style="text-align: right"><label for="name">姓　　名：</label></td>'+
           '<td class="col-md-3">'+
                '<span class="name">' + obj.name +'</span>'+
            '</td>'+
        '</tr>'+
        '<tr>'+
            '<td class="col-md-3" style="text-align: right"><label for="sex">性　　别：</label></td>'+
            '<td class="col-md-3">'+
                '<span class="sex">' + obj.sex +'</span>'+
            '</td>'+
            '<td class="col-md-3" style="text-align: right"><label for="birthday">出生日期：</label></td>'+
            '<td class="col-md-3">'+
                '<span class="birthday">'+ obj.birthday+'</span>'+
            '</td>'+
        '</tr>'+
        '<tr>'+
            '<td class="col-md-3" style="text-align: right"><label for="major">专　　业：</label></td>'+
            '<td class="col-md-3">'+
                '<span class="major">' + obj.major +'</span>'+
            '</td>'+
            '<td class="col-md-3" style="text-align: right"><label for="level">层　　次：</label></td>'+
            '<td class="col-md-3">'+
                '<span class="level">'+obj.level+'</span>'+
            '</td>'+
        '</tr>';
        if(obj.status){
            html += '<tr>' +
                    '<td class="col-md-3" style="text-align: right"><label for="status">证书状态：</label></td>' +
                    '<td><span>' + obj.status + '</span></td>' +
                '</tr>' +
                '<tr>' +
                    '<td class="col-md-3" style="text-align: right"><label for="reason">撤销原因：</label></td>' +
                        '<td colspan="3"><span>' + obj.reason + '</span></input>' +
                '</tr>';
        }
        html += '<tr style="background-color:grey"><td></td><td></td><td></td><td></td></tr>';
    tbody.append(html);   
}

var drawBYZ = function(tbody,obj) {
    var html = '';
    html += '<tr>'+
    '<td class="col-md-3" style="text-align: right"><label for="num">证书编号：</label></td>'+
    '<td class="col-md-3">'+
        '<span class="num">'+obj.num+'</span>'+
    '</td>'+
    '<td class="col-md-3" style="text-align: right"><label for="txtype">证书类别：</label></td>'+
    '<td class="col-md-3">'+
        '<span class="txtype">'+obj.txtype+'</span>'+
    '</td>'+
'</tr>'+
'<tr>'+
    '<td class="col-md-3" style="text-align: right"><label for="schoolsystem">学　　制：</label></td>'+
    '<td class="col-md-3">'+
        '<span id="schoolsystem">'+obj.schoolsystem+'</span>'+
    '</td>'+
    '<td class="col-md-3" style="text-align: right"><label for="school">学　　校：</label></td>'+
    '<td class="col-md-3">'+
        '<span class="school">'+obj.school+'</span>'+
    '</td>'+
'</tr>'+
'<tr>'+
    '<td class="col-md-3" style="text-align: right"><label for="certdate">发证日期：</label></td>'+
    '<td class="col-md-3">'+
        '<span class="certdate">'+obj.certdate+'</span>'+
    '</td>'+
    '<td class="col-md-3" style="text-align: right"><label for="name">姓　　名：</label></td>'+
    '<td class="col-md-3">'+
       ' <span class="name">'+obj.name+'</span>'+
    '</td>'+
'</tr>'+
'<tr>'+
    '<td class="col-md-3" style="text-align: right"><label for="sex">性　　别：</label></td>'+
    '<td class="col-md-3">'+
        '<span class="sex">'+obj.sex+'</span>'+
    '</td>'+
    '<td class="col-md-3" style="text-align: right"><label for="birthday">出生日期：</label></td>'+
    '<td class="col-md-3">'+
        '<span class="birthday">'+obj.birthday+'</span>'+
    '</td>'+
'</tr>'+
'<tr>'+
    '<td class="col-md-3" style="text-align: right"><label for="begin">入学日期：</label></td>'+
    '<td class="col-md-3">'+
        '<span id="begin">'+obj.begin+'</span>'+
    '</td>'+
    '<td class="col-md-3" style="text-align: right"><label for="end">毕业日期：</label></td>'+
    '<td class="col-md-3">'+
        '<span id="end">'+obj.end+'</span>'+
    '</td>'+
'</tr>'+
'<tr>'+
   '<td class="col-md-3" style="text-align: right"><label for="major">专　　业：</label></td>'+
   '<td class="col-md-3">'+
       ' <span class="major">'+obj.major+'</span>'+
    '</td>'+
    '<td class="col-md-3" style="text-align: right"><label for="level">层　　次：</label></td>'+
    '<td class="col-md-3">'+
        '<span class="level">'+obj.level+'</span>'+
    '</td>'+
'</tr>'+
'<tr>'+
    '<td class="col-md-3" style="text-align: right"><label for="form">学习形式：</label></td>'+
    '<td class="col-md-3">'+
        '<span id="form">'+obj.form+'</span>'+
    '</td>'+
    '<td class="col-md-3" style="text-align: right"><label for="class">学历类别：</label></td>'+
    '<td class="col-md-3">'+
        '<span id="class">'+obj.class+'</span>'+
    '</td>'+
'</tr>';
if(obj.status){
            html += '<tr>' +
                    '<td class="col-md-3" style="text-align: right"><label for="status">证书状态：</label></td>' +
                    '<td><span>' + obj.status + '</span></td>' +
                '</tr>' +
                '<tr>' +
                    '<td class="col-md-3" style="text-align: right"><label for="reason">撤销原因：</label></td>' +
                        '<td colspan="3"><span>' + obj.reason + '</span></input>' +
                '</tr>';
        }

    html += '<tr style="background-color:grey"><td></td><td></td><td></td><td></td></tr>';
    tbody.append(html);
}

