USE [master]
GO
/****** Object:  Database [vizkeszlet_gazdalkodas]    Script Date: 05/15/2018 15:56:29 ******/
CREATE DATABASE [vizkeszlet_gazdalkodas] ON  PRIMARY 
( NAME = N'vizkeszlet_gazdalkodas', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL10_50.SQLEXPRESS\MSSQL\DATA\vizkeszlet_gazdalkodas.mdf' , SIZE = 832704KB , MAXSIZE = UNLIMITED, FILEGROWTH = 10%)
 LOG ON 
( NAME = N'vizkeszlet_gazdalkodas_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL10_50.SQLEXPRESS\MSSQL\DATA\vizkeszlet_gazdalkodas_log.ldf' , SIZE = 5605504KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
ALTER DATABASE [vizkeszlet_gazdalkodas] SET COMPATIBILITY_LEVEL = 100
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [vizkeszlet_gazdalkodas].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [vizkeszlet_gazdalkodas] SET ANSI_NULL_DEFAULT OFF
GO
ALTER DATABASE [vizkeszlet_gazdalkodas] SET ANSI_NULLS OFF
GO
ALTER DATABASE [vizkeszlet_gazdalkodas] SET ANSI_PADDING OFF
GO
ALTER DATABASE [vizkeszlet_gazdalkodas] SET ANSI_WARNINGS OFF
GO
ALTER DATABASE [vizkeszlet_gazdalkodas] SET ARITHABORT OFF
GO
ALTER DATABASE [vizkeszlet_gazdalkodas] SET AUTO_CLOSE OFF
GO
ALTER DATABASE [vizkeszlet_gazdalkodas] SET AUTO_CREATE_STATISTICS ON
GO
ALTER DATABASE [vizkeszlet_gazdalkodas] SET AUTO_SHRINK OFF
GO
ALTER DATABASE [vizkeszlet_gazdalkodas] SET AUTO_UPDATE_STATISTICS ON
GO
ALTER DATABASE [vizkeszlet_gazdalkodas] SET CURSOR_CLOSE_ON_COMMIT OFF
GO
ALTER DATABASE [vizkeszlet_gazdalkodas] SET CURSOR_DEFAULT  GLOBAL
GO
ALTER DATABASE [vizkeszlet_gazdalkodas] SET CONCAT_NULL_YIELDS_NULL OFF
GO
ALTER DATABASE [vizkeszlet_gazdalkodas] SET NUMERIC_ROUNDABORT OFF
GO
ALTER DATABASE [vizkeszlet_gazdalkodas] SET QUOTED_IDENTIFIER OFF
GO
ALTER DATABASE [vizkeszlet_gazdalkodas] SET RECURSIVE_TRIGGERS OFF
GO
ALTER DATABASE [vizkeszlet_gazdalkodas] SET  DISABLE_BROKER
GO
ALTER DATABASE [vizkeszlet_gazdalkodas] SET AUTO_UPDATE_STATISTICS_ASYNC OFF
GO
ALTER DATABASE [vizkeszlet_gazdalkodas] SET DATE_CORRELATION_OPTIMIZATION OFF
GO
ALTER DATABASE [vizkeszlet_gazdalkodas] SET TRUSTWORTHY OFF
GO
ALTER DATABASE [vizkeszlet_gazdalkodas] SET ALLOW_SNAPSHOT_ISOLATION OFF
GO
ALTER DATABASE [vizkeszlet_gazdalkodas] SET PARAMETERIZATION SIMPLE
GO
ALTER DATABASE [vizkeszlet_gazdalkodas] SET READ_COMMITTED_SNAPSHOT OFF
GO
ALTER DATABASE [vizkeszlet_gazdalkodas] SET HONOR_BROKER_PRIORITY OFF
GO
ALTER DATABASE [vizkeszlet_gazdalkodas] SET  READ_WRITE
GO
ALTER DATABASE [vizkeszlet_gazdalkodas] SET RECOVERY SIMPLE
GO
ALTER DATABASE [vizkeszlet_gazdalkodas] SET  MULTI_USER
GO
ALTER DATABASE [vizkeszlet_gazdalkodas] SET PAGE_VERIFY CHECKSUM
GO
ALTER DATABASE [vizkeszlet_gazdalkodas] SET DB_CHAINING OFF
GO
USE [vizkeszlet_gazdalkodas]
GO
/****** Object:  Table [dbo].[User]    Script Date: 05/15/2018 15:56:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[User](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](255) NULL,
	[createdAt] [datetimeoffset](7) NULL,
	[updatedAt] [datetimeoffset](7) NULL,
 CONSTRAINT [PK__Users__3213E83F1920BF5C] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TmpStage]    Script Date: 05/15/2018 15:56:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TmpStage](
	[date_time_for] [nvarchar](50) NULL,
	[value] [float] NULL,
	[data_meta_id] [int] NULL,
	[updatedAt] [nvarchar](50) NULL,
	[createdAt] [nvarchar](50) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TmpProfile]    Script Date: 05/15/2018 15:56:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TmpProfile](
	[name] [nvarchar](50) NULL,
	[river_id] [int] NULL,
	[updatedAt] [nvarchar](50) NULL,
	[createdAt] [nvarchar](50) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TmpLocationStage]    Script Date: 05/15/2018 15:56:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TmpLocationStage](
	[date_time_id] [int] NULL,
	[profile_id] [int] NULL,
	[modelling_id] [int] NULL,
	[additional_description_id] [int] NULL,
	[description_id] [int] NULL,
	[value] [float] NULL,
	[updatedAt] [nvarchar](50) NULL,
	[createdAt] [nvarchar](50) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TmpLocationFlow]    Script Date: 05/15/2018 15:56:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TmpLocationFlow](
	[date_time_id] [int] NULL,
	[profile_id] [int] NULL,
	[modelling_id] [int] NULL,
	[additional_description_id] [int] NULL,
	[description_id] [int] NULL,
	[value] [float] NULL,
	[updatedAt] [nvarchar](50) NULL,
	[createdAt] [nvarchar](50) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TmpFlow]    Script Date: 05/15/2018 15:56:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TmpFlow](
	[date_time_for] [nvarchar](50) NULL,
	[value] [float] NULL,
	[data_meta_id] [int] NULL,
	[updatedAt] [nvarchar](50) NULL,
	[createdAt] [nvarchar](50) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Time_interval]    Script Date: 05/15/2018 15:56:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Time_interval](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](50) NOT NULL,
	[sort] [int] NULL,
	[createdAt] [datetime] NULL,
	[updatedAt] [datetime] NULL,
 CONSTRAINT [PK_Time_interval] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Directorate]    Script Date: 05/15/2018 15:56:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Directorate](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](255) NULL,
	[full_name] [nvarchar](100) NULL,
	[city] [nvarchar](50) NULL,
	[address] [nvarchar](100) NULL,
	[phone] [nvarchar](50) NULL,
	[email] [nvarchar](50) NULL,
	[createdAt] [datetime] NULL,
	[updatedAt] [datetime] NULL,
 CONSTRAINT [PK__Director__3213E83F1CF15040] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DescriptionLocationData]    Script Date: 05/15/2018 15:56:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DescriptionLocationData](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[additional_description] [text] NULL,
	[createdAt] [datetime] NULL,
	[updatedAt] [datetime] NULL,
 CONSTRAINT [PK_DescriptionLocationData] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Description]    Script Date: 05/15/2018 15:56:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Description](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[user_description] [text] NULL,
	[date_from] [datetime] NULL,
	[date_to] [datetime] NULL,
	[createdAt] [datetime] NULL,
	[updatedAt] [datetime] NULL,
 CONSTRAINT [PK_Description] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DateTime]    Script Date: 05/15/2018 15:56:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DateTime](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[dt] [datetime] NOT NULL,
	[createdAt] [datetime] NULL,
	[updatedAt] [datetime] NULL,
 CONSTRAINT [PK_Date_Time] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[River]    Script Date: 05/15/2018 15:56:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[River](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](200) NOT NULL,
	[directorate_id] [int] NOT NULL,
	[createdAt] [datetime] NULL,
	[updatedAt] [datetime] NULL,
 CONSTRAINT [PK_river] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Profile]    Script Date: 05/15/2018 15:56:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Profile](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [float] NOT NULL,
	[river_id] [int] NOT NULL,
	[createdAt] [datetime] NULL,
	[updatedAt] [datetime] NULL,
 CONSTRAINT [PK_profile] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Modelling]    Script Date: 05/15/2018 15:56:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Modelling](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](200) NOT NULL,
	[description] [text] NULL,
	[date_for] [nvarchar](50) NOT NULL,
	[river_id] [int] NOT NULL,
	[time_interval_id] [int] NULL,
	[createdAt] [datetime] NULL,
	[updatedAt] [datetime] NULL,
 CONSTRAINT [PK_modelling] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Data_meta]    Script Date: 05/15/2018 15:56:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Data_meta](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[projekt_name] [varchar](50) NULL,
	[date_from] [datetime] NULL,
	[date_to] [datetime] NULL,
	[time_interval_id] [int] NULL,
	[unit] [varchar](20) NULL,
	[modelling_id] [int] NULL,
	[profile_id] [int] NULL,
	[additional_description] [text] NULL,
	[type] [varchar](50) NULL,
	[user_description] [text] NULL,
	[updatedAt] [datetime] NULL,
	[createdAt] [datetime] NULL,
 CONSTRAINT [PK_flow_meta] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[LocationStage]    Script Date: 05/15/2018 15:56:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LocationStage](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[date_time_id] [int] NOT NULL,
	[profile_id] [int] NOT NULL,
	[modelling_id] [int] NULL,
	[additional_description_id] [int] NULL,
	[description_id] [int] NULL,
	[value] [float] NOT NULL,
	[createdAt] [datetime] NULL,
	[updatedAt] [datetime] NULL,
 CONSTRAINT [PK_LocationStage] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [descript_id] ON [dbo].[LocationStage] 
(
	[description_id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [modelling_id] ON [dbo].[LocationStage] 
(
	[modelling_id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LocationFlow]    Script Date: 05/15/2018 15:56:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LocationFlow](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[date_time_id] [int] NOT NULL,
	[profile_id] [int] NOT NULL,
	[modelling_id] [int] NULL,
	[additional_description_id] [int] NULL,
	[description_id] [int] NULL,
	[value] [float] NOT NULL,
	[createdAt] [datetime] NULL,
	[updatedAt] [datetime] NULL,
 CONSTRAINT [PK_Location_flow] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [description_id] ON [dbo].[LocationFlow] 
(
	[description_id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [modelling_id] ON [dbo].[LocationFlow] 
(
	[modelling_id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Stage]    Script Date: 05/15/2018 15:56:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Stage](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[date_time_for] [datetime] NOT NULL,
	[value] [float] NOT NULL,
	[data_meta_id] [int] NOT NULL,
	[updatedAt] [datetime] NULL,
	[createdAt] [datetime] NULL,
 CONSTRAINT [PK_Stage] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FlowOut]    Script Date: 05/15/2018 15:56:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FlowOut](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[date_time_for] [datetime] NOT NULL,
	[value] [float] NOT NULL,
	[data_meta_id] [int] NOT NULL,
	[updatedAt] [datetime] NULL,
	[createdAt] [datetime] NULL,
 CONSTRAINT [PK_FlowOut] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FlowIn]    Script Date: 05/15/2018 15:56:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FlowIn](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[date_time_for] [datetime] NOT NULL,
	[value] [float] NOT NULL,
	[data_meta_id] [int] NOT NULL,
	[updatedAt] [datetime] NULL,
	[createdAt] [datetime] NULL,
 CONSTRAINT [PK_FlowIn] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Flow_cum]    Script Date: 05/15/2018 15:56:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Flow_cum](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[date_time_for] [datetime] NOT NULL,
	[value] [float] NOT NULL,
	[data_meta_id] [int] NOT NULL,
	[updatedAt] [datetime] NULL,
	[createdAt] [datetime] NULL,
 CONSTRAINT [PK_Flow_cum] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Flow]    Script Date: 05/15/2018 15:56:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Flow](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[date_time_for] [datetime] NOT NULL,
	[value] [float] NOT NULL,
	[data_meta_id] [int] NOT NULL,
	[updatedAt] [datetime] NULL,
	[createdAt] [datetime] NULL,
 CONSTRAINT [PK_Flow] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [createdAt_index] ON [dbo].[Flow] 
(
	[createdAt] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
GO
/****** Object:  ForeignKey [FK_River_Directorate]    Script Date: 05/15/2018 15:56:30 ******/
ALTER TABLE [dbo].[River]  WITH CHECK ADD  CONSTRAINT [FK_River_Directorate] FOREIGN KEY([directorate_id])
REFERENCES [dbo].[Directorate] ([id])
GO
ALTER TABLE [dbo].[River] CHECK CONSTRAINT [FK_River_Directorate]
GO
/****** Object:  ForeignKey [FK_Profile_River]    Script Date: 05/15/2018 15:56:30 ******/
ALTER TABLE [dbo].[Profile]  WITH CHECK ADD  CONSTRAINT [FK_Profile_River] FOREIGN KEY([river_id])
REFERENCES [dbo].[River] ([id])
GO
ALTER TABLE [dbo].[Profile] CHECK CONSTRAINT [FK_Profile_River]
GO
/****** Object:  ForeignKey [FK_modelling_River]    Script Date: 05/15/2018 15:56:30 ******/
ALTER TABLE [dbo].[Modelling]  WITH CHECK ADD  CONSTRAINT [FK_modelling_River] FOREIGN KEY([river_id])
REFERENCES [dbo].[River] ([id])
GO
ALTER TABLE [dbo].[Modelling] CHECK CONSTRAINT [FK_modelling_River]
GO
/****** Object:  ForeignKey [FK_Modelling_Time_interval]    Script Date: 05/15/2018 15:56:30 ******/
ALTER TABLE [dbo].[Modelling]  WITH CHECK ADD  CONSTRAINT [FK_Modelling_Time_interval] FOREIGN KEY([time_interval_id])
REFERENCES [dbo].[Time_interval] ([id])
GO
ALTER TABLE [dbo].[Modelling] CHECK CONSTRAINT [FK_Modelling_Time_interval]
GO
/****** Object:  ForeignKey [FK_flow_meta_flow_meta]    Script Date: 05/15/2018 15:56:30 ******/
ALTER TABLE [dbo].[Data_meta]  WITH CHECK ADD  CONSTRAINT [FK_flow_meta_flow_meta] FOREIGN KEY([time_interval_id])
REFERENCES [dbo].[Time_interval] ([id])
GO
ALTER TABLE [dbo].[Data_meta] CHECK CONSTRAINT [FK_flow_meta_flow_meta]
GO
/****** Object:  ForeignKey [FK_flow_meta_modelling]    Script Date: 05/15/2018 15:56:30 ******/
ALTER TABLE [dbo].[Data_meta]  WITH CHECK ADD  CONSTRAINT [FK_flow_meta_modelling] FOREIGN KEY([modelling_id])
REFERENCES [dbo].[Modelling] ([id])
GO
ALTER TABLE [dbo].[Data_meta] CHECK CONSTRAINT [FK_flow_meta_modelling]
GO
/****** Object:  ForeignKey [FK_Flow_meta_Profile]    Script Date: 05/15/2018 15:56:30 ******/
ALTER TABLE [dbo].[Data_meta]  WITH CHECK ADD  CONSTRAINT [FK_Flow_meta_Profile] FOREIGN KEY([profile_id])
REFERENCES [dbo].[Profile] ([id])
GO
ALTER TABLE [dbo].[Data_meta] CHECK CONSTRAINT [FK_Flow_meta_Profile]
GO
/****** Object:  ForeignKey [FK_LocationStage_DateTime]    Script Date: 05/15/2018 15:56:30 ******/
ALTER TABLE [dbo].[LocationStage]  WITH CHECK ADD  CONSTRAINT [FK_LocationStage_DateTime] FOREIGN KEY([date_time_id])
REFERENCES [dbo].[DateTime] ([id])
GO
ALTER TABLE [dbo].[LocationStage] CHECK CONSTRAINT [FK_LocationStage_DateTime]
GO
/****** Object:  ForeignKey [FK_LocationStage_Description]    Script Date: 05/15/2018 15:56:30 ******/
ALTER TABLE [dbo].[LocationStage]  WITH CHECK ADD  CONSTRAINT [FK_LocationStage_Description] FOREIGN KEY([description_id])
REFERENCES [dbo].[Description] ([id])
GO
ALTER TABLE [dbo].[LocationStage] CHECK CONSTRAINT [FK_LocationStage_Description]
GO
/****** Object:  ForeignKey [FK_LocationStage_DescriptionLocationData]    Script Date: 05/15/2018 15:56:30 ******/
ALTER TABLE [dbo].[LocationStage]  WITH CHECK ADD  CONSTRAINT [FK_LocationStage_DescriptionLocationData] FOREIGN KEY([additional_description_id])
REFERENCES [dbo].[DescriptionLocationData] ([id])
GO
ALTER TABLE [dbo].[LocationStage] CHECK CONSTRAINT [FK_LocationStage_DescriptionLocationData]
GO
/****** Object:  ForeignKey [FK_LocationStage_Modelling]    Script Date: 05/15/2018 15:56:30 ******/
ALTER TABLE [dbo].[LocationStage]  WITH CHECK ADD  CONSTRAINT [FK_LocationStage_Modelling] FOREIGN KEY([modelling_id])
REFERENCES [dbo].[Modelling] ([id])
GO
ALTER TABLE [dbo].[LocationStage] CHECK CONSTRAINT [FK_LocationStage_Modelling]
GO
/****** Object:  ForeignKey [FK_LocationStage_Profile]    Script Date: 05/15/2018 15:56:30 ******/
ALTER TABLE [dbo].[LocationStage]  WITH CHECK ADD  CONSTRAINT [FK_LocationStage_Profile] FOREIGN KEY([profile_id])
REFERENCES [dbo].[Profile] ([id])
GO
ALTER TABLE [dbo].[LocationStage] CHECK CONSTRAINT [FK_LocationStage_Profile]
GO
/****** Object:  ForeignKey [FK_LocationFlow_DateTime]    Script Date: 05/15/2018 15:56:30 ******/
ALTER TABLE [dbo].[LocationFlow]  WITH CHECK ADD  CONSTRAINT [FK_LocationFlow_DateTime] FOREIGN KEY([date_time_id])
REFERENCES [dbo].[DateTime] ([id])
GO
ALTER TABLE [dbo].[LocationFlow] CHECK CONSTRAINT [FK_LocationFlow_DateTime]
GO
/****** Object:  ForeignKey [FK_LocationFlow_Description]    Script Date: 05/15/2018 15:56:30 ******/
ALTER TABLE [dbo].[LocationFlow]  WITH CHECK ADD  CONSTRAINT [FK_LocationFlow_Description] FOREIGN KEY([description_id])
REFERENCES [dbo].[Description] ([id])
GO
ALTER TABLE [dbo].[LocationFlow] CHECK CONSTRAINT [FK_LocationFlow_Description]
GO
/****** Object:  ForeignKey [FK_LocationFlow_DescriptionLocationData]    Script Date: 05/15/2018 15:56:30 ******/
ALTER TABLE [dbo].[LocationFlow]  WITH CHECK ADD  CONSTRAINT [FK_LocationFlow_DescriptionLocationData] FOREIGN KEY([additional_description_id])
REFERENCES [dbo].[DescriptionLocationData] ([id])
GO
ALTER TABLE [dbo].[LocationFlow] CHECK CONSTRAINT [FK_LocationFlow_DescriptionLocationData]
GO
/****** Object:  ForeignKey [FK_LocationFlow_Modelling]    Script Date: 05/15/2018 15:56:30 ******/
ALTER TABLE [dbo].[LocationFlow]  WITH CHECK ADD  CONSTRAINT [FK_LocationFlow_Modelling] FOREIGN KEY([modelling_id])
REFERENCES [dbo].[Modelling] ([id])
GO
ALTER TABLE [dbo].[LocationFlow] CHECK CONSTRAINT [FK_LocationFlow_Modelling]
GO
/****** Object:  ForeignKey [FK_LocationFlow_Profile]    Script Date: 05/15/2018 15:56:30 ******/
ALTER TABLE [dbo].[LocationFlow]  WITH CHECK ADD  CONSTRAINT [FK_LocationFlow_Profile] FOREIGN KEY([profile_id])
REFERENCES [dbo].[Profile] ([id])
GO
ALTER TABLE [dbo].[LocationFlow] CHECK CONSTRAINT [FK_LocationFlow_Profile]
GO
/****** Object:  ForeignKey [FK_Stage_Data_meta]    Script Date: 05/15/2018 15:56:30 ******/
ALTER TABLE [dbo].[Stage]  WITH CHECK ADD  CONSTRAINT [FK_Stage_Data_meta] FOREIGN KEY([data_meta_id])
REFERENCES [dbo].[Data_meta] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Stage] CHECK CONSTRAINT [FK_Stage_Data_meta]
GO
/****** Object:  ForeignKey [FK_FlowOut_Data_meta]    Script Date: 05/15/2018 15:56:30 ******/
ALTER TABLE [dbo].[FlowOut]  WITH CHECK ADD  CONSTRAINT [FK_FlowOut_Data_meta] FOREIGN KEY([data_meta_id])
REFERENCES [dbo].[Data_meta] ([id])
GO
ALTER TABLE [dbo].[FlowOut] CHECK CONSTRAINT [FK_FlowOut_Data_meta]
GO
/****** Object:  ForeignKey [FK_FlowIn_Data_meta]    Script Date: 05/15/2018 15:56:30 ******/
ALTER TABLE [dbo].[FlowIn]  WITH CHECK ADD  CONSTRAINT [FK_FlowIn_Data_meta] FOREIGN KEY([data_meta_id])
REFERENCES [dbo].[Data_meta] ([id])
GO
ALTER TABLE [dbo].[FlowIn] CHECK CONSTRAINT [FK_FlowIn_Data_meta]
GO
/****** Object:  ForeignKey [FK_Flow_cum_Data_meta]    Script Date: 05/15/2018 15:56:30 ******/
ALTER TABLE [dbo].[Flow_cum]  WITH CHECK ADD  CONSTRAINT [FK_Flow_cum_Data_meta] FOREIGN KEY([data_meta_id])
REFERENCES [dbo].[Data_meta] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Flow_cum] CHECK CONSTRAINT [FK_Flow_cum_Data_meta]
GO
/****** Object:  ForeignKey [FK_Flow_flow_meta]    Script Date: 05/15/2018 15:56:30 ******/
ALTER TABLE [dbo].[Flow]  WITH CHECK ADD  CONSTRAINT [FK_Flow_flow_meta] FOREIGN KEY([data_meta_id])
REFERENCES [dbo].[Data_meta] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Flow] CHECK CONSTRAINT [FK_Flow_flow_meta]
GO
