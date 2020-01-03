const Main = imports.ui.main;
const Lang = imports.lang;
const PopupMenu = imports.ui.popupMenu;
const { AccountsService, Clutter, GLib, St } = imports.gi;
const { Avatar } = imports.ui.userWidget;

var iconMenuItem;

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
                iconSize: 100
            });

            avatar.update();
            this.iconMenuItem.actor.get_last_child().remove_all_children();     
            this.iconMenuItem.actor.get_last_child().add_child(avatar.actor);

            this.systemMenu.menu.box.get_child_at_index(0).get_child_at_index(1).set_icon_name('avatar-default-symbolic');
        }));
}

function disable() {
    iconMenuItem.destroy();
}

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
