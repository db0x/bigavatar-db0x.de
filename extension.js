const Main = imports.ui.main;
const Lang = imports.lang;
const PopupMenu = imports.ui.popupMenu;
const { AccountsService, Clutter, GLib, St } = imports.gi;
const { Avatar } = imports.ui.userWidget;
const Config = imports.misc.config;
const GObject = imports.gi.GObject;

var iconMenuItem = null;

let shell_Version = Config.PACKAGE_VERSION;

function init() {
}

function enable() {
    this.iconMenuItem = new UserIconMenuItem();
    Main.panel.statusArea.aggregateMenu.menu.addMenuItem(this.iconMenuItem,0);
    
    this.systemMenu = Main.panel.statusArea['aggregateMenu']._system;
    this._menuOpenStateChangedId = this.systemMenu.menu.connect('open-state-changed', Lang.bind(this,
        function(menu, open) {
                if (!open)
                    return;

            var userManager = AccountsService.UserManager.get_default();
            var user = userManager.get_user(GLib.get_user_name());
            var avatar = new Avatar(user, { 
                iconSize: 128
            });

            avatar.update();
            this.iconMenuItem.actor.get_last_child().remove_all_children();     
            this.iconMenuItem.actor.get_last_child().add_child(avatar.actor);

			if ( shell_Version < '3.36' ) {
            	this.systemMenu.menu.box.get_child_at_index(0).get_child_at_index(1).set_icon_name('avatar-default-symbolic');
			}
        }));
}

function disable() {
    if (this._menuOpenStateChangedId) {
        this.systemMenu.menu.disconnect(this._menuOpenStateChangedId);
        this._menuOpenStateChangedId = 0;
    }
    iconMenuItem.destroy();
}

if (shell_Version < '3.36') {
	var UserIconMenuItem = class UserIconMenuItem extends PopupMenu.PopupBaseMenuItem {
	    constructor() {
	        super({
	            reactive: false
	        });
	        var box = new St.BoxLayout({ 
	            x_align: Clutter.ActorAlign.CENTER,
	        });
	        this.actor.add(box, {
	            expand: true
	        });
	    }
	}
} else {
	var UserIconMenuItem = GObject.registerClass(
        {
            GTypeName: 'UserIconMenuItem'
        },
        class UserIconMenuItem extends PopupMenu.PopupBaseMenuItem {
	    	_init() {
                super._init();
		        var box = new St.BoxLayout({ 
		            x_align: Clutter.ActorAlign.CENTER,
		        });
		        this.actor.add(box, {
		            expand: true
		        });
            }
	    }
	);
}
