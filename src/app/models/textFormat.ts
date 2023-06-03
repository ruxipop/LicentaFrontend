
export class TextFormat {
  constructor(font: string, bold: string | null, underline: string | null, italic: string | null, color: string, size: number) {
    this.font=font;
    this.bold=bold;
    this.italic=italic;
    this.underline=underline;
    this.color=color;
    this.size=size;
  }

  font:string;
  bold:string|null;
  underline:string|null;
  italic:string|null;
  color:string;
  size:number;


}
