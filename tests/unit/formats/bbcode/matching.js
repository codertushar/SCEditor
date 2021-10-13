import defaultOptions from 'src/lib/defaultOptions.js';
import 'src/formats/bbcode.js';

QUnit.module('plugins/bbcode - Matching', {
	before: () => {
		sceditor.formats.bbcode.set(
			'thisoldbbcode', {
				tags: {
					abbr: {
						title: ['test'],
						test: null
					}
				},
				matchAttrs: 'all',
				format: function (element, content) {
					return '[abbr=' + element.getAttribute('title') + ']' + content + '[/abbr]';
				},
				html: '<abbr title="{defaultattr}">{0}</abbr>'
			}
		);
		sceditor.formats.bbcode.set(
			'springchicken', {
				tags: {
					bird: {
						type: ['duck'],
						test: null
					}
				},
				matchAttrs: 'any',
				format: function (element, content) {
					return '[bird=' + element.getAttribute('type') + ']' + content + '[/bird]';
				},
				html: '<bird type="{defaultattr}">{0}</bird>'
			}
		);
		sceditor.formats.bbcode.set(
			'insertnamehere', {
				tags: {
					species: {
						classification: ['mammal'],
						test: null
					}
				},
				format: function (element, content) {
					return '[species=' + element.getAttribute('classification') + ']' + content + '[/species]';
				},
				html: '<species classification="{defaultattr}">{0}</species>'
			}
		);
		sceditor.formats.bbcode.set('margin', {
			tags: {
				'p': null
			},
			styles: {
				'margin': null
			},
			format: function (element, content) {
				return '[margin=' + element.style.margin + ']' +
					content + '[/margin]';
			},
			html: '<p style="margin:{defaultattr}">{0}</p>'
		});
	},
	beforeEach: function () {
		this.mockEditor = {
			opts: defaultOptions
		};
		this.format = new sceditor.formats.bbcode();
		this.format.init.call(this.mockEditor);
	},
	after: () => {
		sceditor.formats.bbcode.remove('thisoldbbcode');
		sceditor.formats.bbcode.remove('springchicken');
		sceditor.formats.bbcode.remove('insertnamehere');
		sceditor.formats.bbcode.remove('margin');
	}
});

QUnit.test('match all attrs', function (assert) {
	assert.equal(
		this.mockEditor.toBBCode(
			'<abbr title="attrs.defaultattr" test="value">content</abbr>'
		),
		'content'
	);
	assert.equal(
		this.mockEditor.toBBCode('<abbr title="test" test="value">content</abbr>'),
		'[abbr=test]content[/abbr]'
	);
});
QUnit.test('match any attr', function (assert) {
	assert.equal(
		this.mockEditor.toBBCode(
			'<bird type="attrs.defaultattr" test="value">content</bird>'
		),
		'[bird=attrs.defaultattr]content[/bird]'
	);
	assert.equal(
		this.mockEditor.toBBCode('<bird type="duck" test="value">content</bird>'),
		'[bird=duck]content[/bird]'
	);
});
QUnit.test('match not specified', function (assert) {
	assert.equal(
		this.mockEditor.toBBCode(
			'<species classification="attrs.defaultattr" test="value">content</species>'
		),
		'[species=attrs.defaultattr]content[/species]'
	);
	assert.equal(
		this.mockEditor.toBBCode('<species classification="mammal" test="value">content</species>'),
		'[species=mammal]content[/species]'
	);
});
QUnit.test('unexpected double match', function (assert) {
	assert.equal(
		this.mockEditor.toBBCode('<p style="margin: 1em;">content</p>'),
		'[margin=1em][margin=1em]content[/margin][/margin]'
	);
});
