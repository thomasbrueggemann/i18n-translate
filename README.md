# i18n-translate [![Build Status](https://travis-ci.org/tomaszbrue/i18n-translate.svg)](https://travis-ci.org/tomaszbrue/i18n-translate)

Automatically translates [require.js i18n](http://requirejs.org/docs/api.html#i18n) javascript files into different languages via Google Translate API

## Installation

```
npm install -g i18n-translate
```

## Usage

You need a [Google Translate API Key](https://cloud.google.com/translate/).

```
i18n-translate apiKEy startDir sourceLang targetLang1,targetLang2
```

e.g.

```
i18n-translate iuOHAEbo9H788d34h93h4diouehIUHI test/data/ de en,fr
```
