const {log, clear} = console;
// const Jimp = require('jimp');
const sharp = require('sharp');
const fs = require('fs');

const assets_file_path = './assets/';
const output_file_path = './output/';

const files = fs.readdir(assets_file_path, (err, files) => {

	files.forEach((file, index) => {

		const image = sharp(`${assets_file_path}/${file}`);

		image.metadata()
			.then(metadata => metadata)
			.then(metadata => {
				log(metadata);
				const {width, height} = metadata;
				const two_thirds = num => num * (2 / 3);
				const half = num => num * (1 / 2);
				const ratio_fn = (width >= height) ? two_thirds : half;
				
				const [
					new_width,
					new_height
				] = [width, height].map(size => Math.round(ratio_fn(size)));

				return {new_width, new_height};

			})
			.then(({new_width, new_height}) => {
				return image.resize(new_width, new_height).max();
			})
			.then(processed_img => {
				return processed_img
					.jpeg({
						quality: 60, 
						progressive: true, 
						chromaSubsampling: '4:4:4',
						force: false
					})
			})
			.then(formatted_img => {
				return formatted_img.toFile(`${output_file_path}${file}`);
			})
			.then(info => log(info));
	// 	sharp(`${assets_file_path}/${files[2]}`)
	// 	.jpeg({quality: 80})
	// .toFile(`./output/output.jpg`)
	// .then(info => log(info));
	});
	
});