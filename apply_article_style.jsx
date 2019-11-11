//
//	This script replaces para styles and char styles in an article based on
//	the (indesign) article name. The (indesign) article name is used as a 
//	style group name, in which we will find the standard set of para styles and char styles
//
//	Each (indesign) article on the layout has it's unique style group and as such can be
//	individually styled 
//
//	Preferably this script is called automatically after an article is placed or updated.
//	For the demo this script is triggered by 'afterPlace' or by 'afterRefreshArticle'
//



(function apply_article_style() {

	//
	//	Find article to apply style on. 
	//	1. selected article
	//	2. 'pageitem' refers to target frame when afterPlace.jsx is triggered
	//	3. 'Core_ID' refers to updated article when afterRefreshArticle.jsx is triggered
	//
	function lookup_article() {
		var item = app.selection[0];
		
		if (!item && app.scriptArgs.isDefined('pageitem')) {
			var item = app.documents[0].allPageItems.getItemByID(app.scriptArgs.get('pageitem'));
			// alert(item);
		}
		
		if (!item && app.scriptArgs.isDefined('Core_ID')) {
			var core_id = app.scriptArgs.get('Core_ID');
			var managedarticles = app.documents[0].managedArticles
			for (var i=0; i<managedarticles.length; i++) {
				var managedarticle = managedarticles[i];
				if (managedarticle.entMetaData.get('Core_ID') == core_id) {
					var item = managedarticle.components[0].textFrames[0];
				}
			}	
			// alert(item);
		}

		if (item.allArticles.length) {
			return item.allArticles[0];
		}
		
		return null;
	}

	//
	//	Lookup matching style(name) in stylegroup collection
	//
	function lookup_style(styles, stylename) {
		var stylebase = stylename.split(/[ _-]/)[0];
		return (styles.itemByName(stylebase));
	}

	
	try {
		// script operates on selected item
		var doc = app.activeDocument;
		var article = lookup_article();
		
// article name will define the style group to be used for the placed text
// 			var group = article.name;
		if (article != null) {
			// now update styles on each member of the article
			var members = article.articleMembers;
			for (var i=0; i<members.length; i++) {
		
				// article member represents a page item
				var item = members[i].itemRef;
			
				// if the pageitem implements 'parentStory' it is a text frame
				if ('parentStory' in item) {
			
					//
					var obs = item.appliedObjectStyle.name;
					if (obs[0] != '[') 
						group = obs;
					else
						group = article.name;
					
					// alert(group);
					// we need the story, as it contains the text
					var story = item.parentStory;
				
					// locate new style groups (paragraph and character) for the article name
					var pg = doc.paragraphStyleGroups.itemByName(group);
					var cg = doc.characterStyleGroups.itemByName(group);

					// combinations of para styles and char styles are applied on so called
					// 'textStyleRanges'. We will iterate those textStyleRanges, which is
					// faster than iterating Paragraphs and Characters separately
					for (var p=0; p<story.textStyleRanges.length; p++) {
						var tsr = story.textStyleRanges[p];
					
						// get para style name and char style name
						var psname  = tsr.appliedParagraphStyle.name;
						var csname  = tsr.appliedCharacterStyle.name;
				
						// get the style objects from the new group
						// and apply them (ignore error if style does not exist in new group)
						try {
							var ps = lookup_style(pg.paragraphStyles,psname);	
							tsr.applyParagraphStyle(ps);
						} catch(err) {}
					
						try {
							var cs = lookup_style(cg.characterStyles,csname);
							tsr.applyCharacterStyle(cs);
						} catch(err) {}
					}
				}
			}
		}
	} catch (err) {
		// do not expect any errors, just in case...
		alert(err);
	}
})();