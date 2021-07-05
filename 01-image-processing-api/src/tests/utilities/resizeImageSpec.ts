import path from 'path';
import { PathLike, promises as fs } from 'fs';
import resizeImage from '../../utilities/resizeImage';

describe('expect images module resizeFile work correctly', () => {
  describe('expect resizeImage works as expected', () => {
    const thumbFile: PathLike = path.resolve(__dirname, '../assets/thumb/fjord-200x200.jpg');
    const imageSampleFile: PathLike = path.resolve(__dirname, '../assets/images/fjord.jpg');
    const imageNotExists: PathLike = path.resolve(__dirname, '../assets/images/doNotExists.jpg');

    afterAll(async () => {
      // Delete files
      await fs.rm(thumbFile);
    });

    it('expect resizeImage should save a new image correctly', async () => {
      // Act
      await resizeImage(imageSampleFile, thumbFile, 200, 200);
      // Assert
      await expectAsync(fs.access(thumbFile)).toBeResolved();
    });

    it('expect resizeImage dont save a new image if source image does not exists', async () => {
      // Act
      await expectAsync(resizeImage(imageNotExists, thumbFile, 200, 200)).toBeRejected();
    });
  });
});
