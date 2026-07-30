/*
  Warnings:

  - You are about to alter the column `ReleaseDate` on the `ContributionReleases` table. The data in that column could be lost. The data in that column will be cast from `DateTime2` to `Date`.

*/
BEGIN TRY

BEGIN TRAN;

-- Drop the default constraint before changing the column type.
ALTER TABLE [dbo].[ContributionReleases] DROP CONSTRAINT [ContributionReleases_ReleaseDate_df];

-- AlterTable
ALTER TABLE [dbo].[ContributionReleases] ALTER COLUMN [ReleaseDate] DATE NOT NULL;

-- Recreate the default constraint for ReleaseDate.
ALTER TABLE [dbo].[ContributionReleases] ADD CONSTRAINT [ContributionReleases_ReleaseDate_df] DEFAULT (GETDATE()) FOR [ReleaseDate];

-- AlterTable
ALTER TABLE [dbo].[Members] ADD [Location] NVARCHAR(200),
[Occupation] NVARCHAR(150);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
