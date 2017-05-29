function getTemplateAjax(path, target) {
    var source;
    var template;
    $.ajax({
        url: path,
        success: function (data) {
            console.log("Here");
            $(target).html(data);
        }
    });
}
$(() => {
    getTemplateAjax("conditions.html", ".content-section");
});
//# sourceMappingURL=navigation.js.map