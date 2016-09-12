var fs = require('fs');
var parse = require('csv-parse');
var async = require('async');
var iconv = require('iconv-lite');

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

var inputFile = process.argv[2];

if (typeof inputFile === 'undefined') {
	console.error('Не указан файл');
	process.exit(1);
	return;
}

var outputFile = 'test.html';
var outputHtml = '';


/* Индексы в таблицах */
var CATEGORY = 0;
var NAME = 1;
var PRICE = 2;

var parser = parse({delimiter: ';'}, function (err, data) {
	var category = '';

	for (var index in data) {
		var Row = data[index];
		
		var new_category = Row[CATEGORY].trim();

		if (new_category != '') {
			category = new_category;
			outputHtml += '\n\n<div class="menu_list__title">' + category + '</div>\n';
			continue;
		}

		var name = Row[NAME].trim();
		if (name === '')
			continue; /* Если нет названия и это не категория. */

		while (name.indexOf('  ') > 0) {
			name = name.replaceAll('  ', ' ');
		}

		outputHtml += '<div class="menu_list__item">' + name;

		if (Row[PRICE].trim() != '') {
			outputHtml += '<span class="price">' + Row[PRICE].trim() + '</span>';
		}

		outputHtml += '</div> \n';

	}

	console.log(outputHtml);
	fs.writeFile(outputFile, outputHtml);
});

fs.createReadStream(inputFile).pipe(iconv.decodeStream('win1251')).pipe(parser);
