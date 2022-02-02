import type { Stream } from 'node:stream';
import type { Buffer } from 'node:buffer';
import type { APIAttachment } from 'discord-api-types/v9';

export class UnsafeAttachment {
	public readonly attachment?: Stream | Buffer;
	public readonly filename?: string;
	public readonly description?: string;
	public readonly spoiler?: boolean;

	public constructor(attachment?: Stream | Buffer, filename?: string) {
		this.attachment = attachment;
		this.filename = filename;
	}

	/**
	 * Sets the description of this attachment.
	 * @param description The description of the file
	 */
	public setDescription(description: string) {
		Reflect.set(this, 'description', description);
		return this;
	}

	/**
	 * Sets the file of this attachment.
	 * @param attachment The file
	 * @param filename The name of the file, if any
	 */
	public setFile(attachment: Stream | Buffer, filename: string | null = null) {
		Reflect.set(this, 'attachment', attachment);
		Reflect.set(this, 'filename', filename);
		return this;
	}

	/**
	 * Sets the name of this attachment.
	 * @param filename The name of the file
	 */
	public setFilename(filename: string) {
		Reflect.set(this, 'filename', filename);
		return this;
	}

	/**
	 * Sets whether this attachment is a spoiler
	 * @param spoiler Whether the attachment should be marked as a spoiler
	 */
	public setSpoiler(spoiler = true) {
		if (spoiler === this.spoiler) return this;

		if (!spoiler) {
			while (this.spoiler) {
				Reflect.set(this, 'filename', this.filename?.slice('SPOILER_'.length) ?? null);
			}
			return this;
		}

		Reflect.set(this, 'filename', `SPOILER_${this.filename ?? ''}`);
		return this;
	}

	public toJSON(): Pick<APIAttachment, 'description'> & Partial<Pick<APIAttachment, 'filename'>> {
		return { ...this };
	}
}
