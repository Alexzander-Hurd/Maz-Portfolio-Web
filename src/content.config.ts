import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';
import path from 'path';
import fs, { stat } from 'fs/promises';
import { ExifDateTime, exiftool } from 'exiftool-vendored';
import { title } from 'process';


function exifToDate(d: unknown): Date | null {
  // exiftool-vendored may return ExifDateTime, string, or undefined
  if (!d) return null;
  if (d instanceof ExifDateTime) return d.toDate();
  if (typeof d === "string") {
    // exif strings are often "YYYY:MM:DD HH:MM:SS"
    const s = d.replace(/^(\d{4}):(\d{2}):(\d{2})/, "$1-$2-$3");
    const dt = new Date(s.replace(" ", "T"));
    return isNaN(+dt) ? null : dt;
  }
  return null;
}


const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
		}),
});


const portfolio = defineCollection({
	loader: glob({ base: './src/content/portfolio', pattern: '**/*.md' }),

	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			image: image().optional(),
		}),
})

const work = defineCollection({
	loader: glob({ base: './src/content/work', pattern: '**/*.md' }),

	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			image: image().optional(),
		}),
})

const photos = defineCollection({
	loader: async() => {

		const imagesdir = path.resolve('./src/content/photos');
		const files = await fs.readdir(imagesdir);
		const images = files.filter((file) => /\.(jpe?g|png|)$/i.test(file));

		const metadata = await Promise.all(images.map(async (filename) => {
			const filepath = path.join(imagesdir, filename);
			const exif = await exiftool.read(filepath);

			const pubDate = 
				exifToDate(exif.DateTimeOriginal) ||
				exifToDate(exif.CreateDate) ||
				exifToDate(exif.ModifyDate) ||
				exifToDate(exif.FileModifyDate) ||
				await stat(filepath).then((s) => s.mtime);

			const camera = 
				exif.Model || "Unknown";

			const lens = 
				exif.LensModel || "Unknown";

			const exposure = 
				exif.ExposureTime || "Unknown";

			const aperture = 
				exif.ApertureValue || "Unknown";

			const iso = 
				exif.ISO || "Unknown";

			const focal = 
				exif.FocalLength || "Unknown";

			const shutter = 
				exif.ShutterSpeedValue || "Unknown";



			return {
				title: filename.split('.').slice(0, -1).join('.') || "",
				id: filepath,
				image: filepath,
				pubDate: pubDate,
				camera: camera,
				lens: lens,
				exposure: exposure,
				aperture: aperture,
				iso: iso,
				focal: focal,
				shutter: shutter
			}
		}));

		await exiftool.end();
		return metadata;

	},
	schema: ({ image }) => z.object({
			title: z.string(),
    		pubDate: z.coerce.date(),
			camera: z.string(),
			lens: z.string(),
			exposure: z.coerce.string(),
			aperture: z.coerce.string(),
			iso: z.coerce.string(),
			focal: z.string(),
			shutter: z.coerce.string(),
			image: image().optional(),
  		}),
})

export const collections = { blog, portfolio, work, photos };
