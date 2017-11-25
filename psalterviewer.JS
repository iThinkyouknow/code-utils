const fs = require('fs');

const {log} = console;

const psalterJSON = require('~/Dropbox/iOS App dev/Test2/Test2/PsalterJson1.json');

const psalter_kv_array = Object.entries(psalterJSON);

const new_array = psalter_kv_array.map(([key, val], i) => {
	const key_int = parseInt(key);
	const {meter, psalm, scoreRef, content, ref } = val;
	const title_name = val["title name"];

	const new_content = content.split(/\n\s*\n/g)
															.map(s => s.split('\n').map(str => str.replace(/\d+\.\s*/, '').trim()));

	const split_ref = (ref) ? ref.split(/\n\d+\s*/g) : ref;
	const no_first_num_ref = (split_ref) ? [split_ref[0].replace(/^\d+\s*/, ''), ...split_ref.slice(1)] : ref;

	const new_ref = (no_first_num_ref) ? no_first_num_ref.map((str) => {
		const ref_match = str.match(/^\d+:(\d+)\s*\-\s*(.+)/);
		
		return {
			v: ref_match[1],
			refs: ref_match[2]
		}
	}) : undefined;

	if (ref && i === 0) log(new_ref);
	
	return {
		no: key_int,
		title: title_name, 
		meter, 
		psalm: parseInt(psalm.replace(/psalm\s*/i, '')), 
		scoreRef, 
		content: new_content, 
		ref: new_ref ? new_ref : undefined,
	}
});

const output = JSON.stringify(new_array, null, 4);
log(output);

fs.writeFileSync('~/Desktop/outputJson.json', output, 'utf-8');