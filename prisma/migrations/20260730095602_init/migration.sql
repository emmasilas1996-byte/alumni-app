BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[OrganizationSettings] (
    [SettingId] INT NOT NULL IDENTITY(1,1),
    [GroupName] NVARCHAR(150) NOT NULL,
    [LogoData] VARBINARY(max),
    [LogoContentType] NVARCHAR(50),
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [OrganizationSettings_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [OrganizationSettings_pkey] PRIMARY KEY CLUSTERED ([SettingId])
);

-- CreateTable
CREATE TABLE [dbo].[Members] (
    [MemberId] INT NOT NULL IDENTITY(1,1),
    [FirstName] NVARCHAR(100) NOT NULL,
    [LastName] NVARCHAR(100) NOT NULL,
    [Email] VARBINARY(max),
    [Phone] VARBINARY(max),
    [DateOfBirth] DATE NOT NULL,
    [PhotoData] VARBINARY(max),
    [PhotoContentType] NVARCHAR(50),
    [Thoughts] NVARCHAR(1000),
    [IsExecutive] BIT NOT NULL CONSTRAINT [Members_IsExecutive_df] DEFAULT 0,
    [ExecutiveTitle] NVARCHAR(100),
    [DateJoined] DATE,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Members_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [Members_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Members_pkey] PRIMARY KEY CLUSTERED ([MemberId])
);

-- CreateTable
CREATE TABLE [dbo].[Users] (
    [UserId] INT NOT NULL IDENTITY(1,1),
    [Username] NVARCHAR(100) NOT NULL,
    [PasswordHash] NVARCHAR(300) NOT NULL,
    [MemberId] INT,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Users_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Users_pkey] PRIMARY KEY CLUSTERED ([UserId]),
    CONSTRAINT [Users_Username_key] UNIQUE NONCLUSTERED ([Username]),
    CONSTRAINT [Users_MemberId_key] UNIQUE NONCLUSTERED ([MemberId])
);

-- CreateTable
CREATE TABLE [dbo].[ContributionTypes] (
    [ContributionId] INT NOT NULL IDENTITY(1,1),
    [Title] NVARCHAR(150) NOT NULL,
    [Description] NVARCHAR(500),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [ContributionTypes_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedByUserId] INT,
    CONSTRAINT [ContributionTypes_pkey] PRIMARY KEY CLUSTERED ([ContributionId])
);

-- CreateTable
CREATE TABLE [dbo].[ContributionReleases] (
    [ReleaseId] INT NOT NULL IDENTITY(1,1),
    [ContributionId] INT NOT NULL,
    [AmountReleased] DECIMAL(12,2) NOT NULL,
    [Purpose] NVARCHAR(300) NOT NULL,
    [ReceiptData] VARBINARY(max),
    [ReceiptContentType] NVARCHAR(50),
    [ReleaseDate] DATETIME2 NOT NULL CONSTRAINT [ContributionReleases_ReleaseDate_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedByUserId] INT,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [ContributionReleases_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [ContributionReleases_pkey] PRIMARY KEY CLUSTERED ([ReleaseId])
);

-- CreateTable
CREATE TABLE [dbo].[ContributionPayments] (
    [PaymentId] INT NOT NULL IDENTITY(1,1),
    [ContributionId] INT NOT NULL,
    [MemberId] INT NOT NULL,
    [Amount] DECIMAL(12,2) NOT NULL,
    [ReceiptData] VARBINARY(max),
    [ReceiptContentType] NVARCHAR(50),
    [PaymentMethod] NVARCHAR(20) NOT NULL CONSTRAINT [ContributionPayments_PaymentMethod_df] DEFAULT 'Manual',
    [PaystackReference] NVARCHAR(100),
    [PaymentDate] DATE NOT NULL CONSTRAINT [ContributionPayments_PaymentDate_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedByUserId] INT,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [ContributionPayments_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [ContributionPayments_pkey] PRIMARY KEY CLUSTERED ([PaymentId])
);

-- CreateTable
CREATE TABLE [dbo].[MonthlyDues] (
    [DueId] INT NOT NULL IDENTITY(1,1),
    [DueYear] SMALLINT NOT NULL,
    [DueMonth] TINYINT NOT NULL,
    [MemberId] INT NOT NULL,
    [Amount] DECIMAL(12,2) NOT NULL,
    [ReceiptData] VARBINARY(max),
    [ReceiptContentType] NVARCHAR(50),
    [PaymentMethod] NVARCHAR(20) NOT NULL CONSTRAINT [MonthlyDues_PaymentMethod_df] DEFAULT 'Manual',
    [PaystackReference] NVARCHAR(100),
    [PaymentDate] DATE NOT NULL CONSTRAINT [MonthlyDues_PaymentDate_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedByUserId] INT,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [MonthlyDues_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [MonthlyDues_pkey] PRIMARY KEY CLUSTERED ([DueId]),
    CONSTRAINT [MonthlyDues_MemberId_DueYear_DueMonth_key] UNIQUE NONCLUSTERED ([MemberId],[DueYear],[DueMonth])
);

-- CreateTable
CREATE TABLE [dbo].[PaystackWebhookLog] (
    [WebhookLogId] INT NOT NULL IDENTITY(1,1),
    [EventType] NVARCHAR(50) NOT NULL,
    [Reference] NVARCHAR(100) NOT NULL,
    [RawPayload] NVARCHAR(max),
    [Processed] BIT NOT NULL CONSTRAINT [PaystackWebhookLog_Processed_df] DEFAULT 0,
    [ReceivedAt] DATETIME2 NOT NULL CONSTRAINT [PaystackWebhookLog_ReceivedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PaystackWebhookLog_pkey] PRIMARY KEY CLUSTERED ([WebhookLogId])
);

-- CreateTable
CREATE TABLE [dbo].[ConstitutionSections] (
    [SectionId] INT NOT NULL IDENTITY(1,1),
    [Title] NVARCHAR(200) NOT NULL,
    [OrderIndex] INT NOT NULL,
    [Content] NVARCHAR(max) NOT NULL,
    [ParentSectionId] INT,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [ConstitutionSections_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [ConstitutionSections_pkey] PRIMARY KEY CLUSTERED ([SectionId])
);

-- CreateTable
CREATE TABLE [dbo].[EmailLog] (
    [EmailLogId] INT NOT NULL IDENTITY(1,1),
    [MemberId] INT NOT NULL,
    [EmailType] NVARCHAR(30) NOT NULL,
    [SentAt] DATETIME2 NOT NULL CONSTRAINT [EmailLog_SentAt_df] DEFAULT CURRENT_TIMESTAMP,
    [Status] NVARCHAR(20) NOT NULL CONSTRAINT [EmailLog_Status_df] DEFAULT 'Sent',
    CONSTRAINT [EmailLog_pkey] PRIMARY KEY CLUSTERED ([EmailLogId])
);

-- AddForeignKey
ALTER TABLE [dbo].[Users] ADD CONSTRAINT [Users_MemberId_fkey] FOREIGN KEY ([MemberId]) REFERENCES [dbo].[Members]([MemberId]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ContributionTypes] ADD CONSTRAINT [ContributionTypes_CreatedByUserId_fkey] FOREIGN KEY ([CreatedByUserId]) REFERENCES [dbo].[Users]([UserId]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ContributionReleases] ADD CONSTRAINT [ContributionReleases_ContributionId_fkey] FOREIGN KEY ([ContributionId]) REFERENCES [dbo].[ContributionTypes]([ContributionId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ContributionReleases] ADD CONSTRAINT [ContributionReleases_CreatedByUserId_fkey] FOREIGN KEY ([CreatedByUserId]) REFERENCES [dbo].[Users]([UserId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ContributionPayments] ADD CONSTRAINT [ContributionPayments_ContributionId_fkey] FOREIGN KEY ([ContributionId]) REFERENCES [dbo].[ContributionTypes]([ContributionId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ContributionPayments] ADD CONSTRAINT [ContributionPayments_MemberId_fkey] FOREIGN KEY ([MemberId]) REFERENCES [dbo].[Members]([MemberId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ContributionPayments] ADD CONSTRAINT [ContributionPayments_CreatedByUserId_fkey] FOREIGN KEY ([CreatedByUserId]) REFERENCES [dbo].[Users]([UserId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[MonthlyDues] ADD CONSTRAINT [MonthlyDues_MemberId_fkey] FOREIGN KEY ([MemberId]) REFERENCES [dbo].[Members]([MemberId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[MonthlyDues] ADD CONSTRAINT [MonthlyDues_CreatedByUserId_fkey] FOREIGN KEY ([CreatedByUserId]) REFERENCES [dbo].[Users]([UserId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ConstitutionSections] ADD CONSTRAINT [ConstitutionSections_ParentSectionId_fkey] FOREIGN KEY ([ParentSectionId]) REFERENCES [dbo].[ConstitutionSections]([SectionId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[EmailLog] ADD CONSTRAINT [EmailLog_MemberId_fkey] FOREIGN KEY ([MemberId]) REFERENCES [dbo].[Members]([MemberId]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
