package com.zimmer.englishdaily;

import android.app.Activity;
import android.content.Intent;
import android.content.res.Configuration;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.view.Window;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.util.Locale;

/**
 * Thin shell around the web app. The app itself is loaded from APP_URL, so every push to the
 * repository's main branch reaches installed phones on the next launch — no reinstall needed.
 * The page caches itself (service worker), so after the first launch it also opens offline.
 */
public class MainActivity extends Activity {
    static final String APP_URL = "https://english-daily-7f3.pages.dev/";
    static final String OFFLINE_URL = "file:///android_asset/offline.html";

    private WebView web;
    private TextToSpeech tts;
    private volatile boolean ttsReady = false;
    private int utterId = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        boolean night = (getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK)
                == Configuration.UI_MODE_NIGHT_YES;
        int bg = night ? Color.parseColor("#17112A") : Color.parseColor("#FFF5E8");
        int bar = night ? Color.parseColor("#2A2145") : Color.parseColor("#FFFFFF");
        Window w = getWindow();
        if (Build.VERSION.SDK_INT >= 21) {
            w.setStatusBarColor(bg);
            w.setNavigationBarColor(bar);
        }
        int flags = 0;
        if (!night && Build.VERSION.SDK_INT >= 23) flags |= 0x00002000; // light status bar icons
        if (!night && Build.VERSION.SDK_INT >= 26) flags |= 0x00000010; // light navigation bar icons
        w.getDecorView().setSystemUiVisibility(flags);

        web = new WebView(this);
        web.setBackgroundColor(bg);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setTextZoom(100);
        s.setAllowFileAccess(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setCacheMode(WebSettings.LOAD_DEFAULT);
        web.addJavascriptInterface(new Speech(), "AndroidTTS");
        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url.startsWith(APP_URL) || url.startsWith("file:///android_asset/")) return false;
                try {
                    startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
                } catch (Exception ignored) { }
                return true;
            }

            /* Called for the main page only: no connection on the very first launch. */
            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                if (failingUrl != null && failingUrl.startsWith(APP_URL)) view.loadUrl(OFFLINE_URL);
            }
        });
        setContentView(web);
        if (savedInstanceState != null) web.restoreState(savedInstanceState);
        else web.loadUrl(APP_URL);

        tts = new TextToSpeech(getApplicationContext(), new TextToSpeech.OnInitListener() {
            @Override
            public void onInit(int status) {
                if (status != TextToSpeech.SUCCESS || tts == null) return;
                int r = tts.setLanguage(Locale.US);
                if (r == TextToSpeech.LANG_MISSING_DATA || r == TextToSpeech.LANG_NOT_SUPPORTED) r = tts.setLanguage(Locale.UK);
                if (r == TextToSpeech.LANG_MISSING_DATA || r == TextToSpeech.LANG_NOT_SUPPORTED) tts.setLanguage(Locale.ENGLISH);
                tts.setSpeechRate(0.9f);
                ttsReady = true;
            }
        });
    }

    private void say(String text, int mode) {
        if (!ttsReady || tts == null || text == null) return;
        utterId++;
        tts.speak(text, mode, null, "u" + utterId);
    }

    public class Speech {
        @JavascriptInterface
        public void speak(String text) { say(text, TextToSpeech.QUEUE_FLUSH); }

        @JavascriptInterface
        public void add(String text) { say(text, TextToSpeech.QUEUE_ADD); }

        @JavascriptInterface
        public void stop() { if (tts != null) tts.stop(); }

        @JavascriptInterface
        public boolean ready() { return ttsReady; }

        /* Used by the offline screen's "Try again" button. */
        @JavascriptInterface
        public void retry() {
            runOnUiThread(new Runnable() {
                @Override
                public void run() { if (web != null) web.loadUrl(APP_URL); }
            });
        }
    }

    @Override
    public void onBackPressed() {
        if (web == null) { super.onBackPressed(); return; }
        web.evaluateJavascript("(window.__back && window.__back()) ? 'y' : 'n'", new ValueCallback<String>() {
            @Override
            public void onReceiveValue(String value) {
                if (value == null || !value.contains("y")) finish();
            }
        });
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        if (web != null) web.saveState(outState);
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (tts != null) tts.stop();
    }

    @Override
    protected void onDestroy() {
        if (tts != null) { tts.stop(); tts.shutdown(); tts = null; }
        if (web != null) { web.destroy(); web = null; }
        super.onDestroy();
    }
}
