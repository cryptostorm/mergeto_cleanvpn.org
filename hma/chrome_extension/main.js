var proxy_sites = {
  'random' : 'Random site',
  'hidemyass.com' : 'HideMyAss.com',
  'anon.me' : 'Anon.me',
  'anonr.com' : 'Anonr.com',
  'armyproxy.com' : 'ArmyProxy.com',
  'boratproxy.com' : 'BoratProxy.com',
  'browse.ms' : 'Browse.ms',
  'hidemy.info' : 'HideMy.info',
  'invisiblesurfing.com' : 'InvisibleSurfing.com',
  'kroxy.net' : 'Kroxy.net',
  'limitkiller.com' : 'Limitkiller.com',
  'nuip.net' : 'Nuip.net',
  'ourproxy.com' : 'Ourproxy.com',
  'proxrio.com' : 'Proxrio.com',
  'proxybuddy.com' : 'Proxybuddy.com',
  'proxymafia.net' : 'Proxymafia.net',
  'sitesurf.net' : 'Sitesurf.net',
  'texasproxy.com' : 'Texasproxy.com',
  'unblocked.org' : 'Unblocked.org',
  'unblock.biz' : 'Unblock.biz'
}

var props_defs = {
  proxy_site : 'hidemyass.com',
  proxy_server : 'random',
  url_encrypt : 'encoded',
  proxy_ssl : 0,
  incognito : 0,
  new_tab : 0,
  always_popup : 0,
  context_menu : 1
};

var context_menu_id = 0,
  proxy_sites_count = getSitesCount(),
  svc_url_path = '/includes/process.php?action=update&idx=0&u=%url&obfuscation=%hash';

function init() {
  checkConfig();
  onTabSelected();
  chrome.tabs.onSelectionChanged.addListener(onTabSelected);
  chrome.tabs.onUpdated.addListener(onTabUpdated);
  chrome.browserAction.onClicked.addListener(onBrowserActionClick);
  chrome.extension.onRequest.addListener(onRequest);
  if ('omnibox' in chrome) {
    chrome.omnibox.onInputEntered.addListener(onKeywordEntered);
  }
  toggleContextMenuItem();
  onFirstRun();
}

function toggleContextMenuItem() {
  if (+localStorage.context_menu) {
    if (!context_menu_id) {
      context_menu_id = chrome.contextMenus.create({
        type : 'normal',
        title : 'Open via HMA Proxy',
        contexts : ['link'],
        onclick : function (ev, tab) {
          navigate(tab, ev.linkUrl, 'link');
        },
        targetUrlPatterns : ['http://*/*', 'https://*/*']
      });
    }
  } else {
    if (context_menu_id) {
      chrome.contextMenus.remove(context_menu_id);
      context_menu_id = 0;
    }
  }
}

function onRequest(url, sender, sendResponse) {
  url = protocolifyURL(url);
  chrome.tabs.getSelected(null, function (tab) {
    navigate(tab, url, 'action_button');
  });
}

function onTabSelected(tab_id, select_info) {
  chrome.tabs.getSelected(null, togglePopupSetting);
}

function onTabUpdated(tab_id, change_info, tab_updated) {
  chrome.tabs.getSelected(null, function (tab_selected) {
    if (tab_updated.id == tab_selected.id) {
      togglePopupSetting(tab_selected);
    }
  })
}

function togglePopupSetting(tab) {  
  var show_popup = (+localStorage.always_popup || !checkURLCredibility(tab.url));
  chrome.browserAction.setPopup({ popup: show_popup ? 'popup.html' : '' });
}

function onKeywordEntered(text) {
  chrome.tabs.getSelected(null, function (tab) {
    var url = protocolifyURL(text);
    navigate(tab, url, 'keyword');
  });
}

fun...
