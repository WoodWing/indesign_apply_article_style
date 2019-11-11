try {
    
    var scriptfile = File(app.scriptPreferences.scriptsFolder+"/apply_article_style.jsx");
    app.doScript(scriptfile, ScriptLanguage.JAVASCRIPT, app.selection, UndoModes.ENTIRE_SCRIPT, "Apply article style...");
    
} catch (err) {
    alert( 'EVENT ERROR '+err);
}