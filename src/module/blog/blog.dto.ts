export class GetBlogListResponseDto {
  title: string;
  content: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateBlogDto {
  title: string;
  content: string;
  createdBy: string;
}

export class UpdateBlogDto {
  title?: string;
  content?: string;
  createdBy?: string;
}
