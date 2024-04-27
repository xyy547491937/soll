设计一个数据库系统来跟踪和管理用户通过分享链接获得积分的逻辑，我们需要考虑以下几个关键点：

1. 用户表（Users）：存储用户的基本资料。
2. 分享链接表（SharedLinks）：存储由用户生成的分享链接信息。
3. 积分记录表（PointsRecords）：记录用户通过分享链接获得的积分。

以下是可能的数据库设计：

### 用户表（Users）
- UserID: 主键，唯一标识每个用户。
- Username: 用户名。
- InitialPoints: 用户初始化时的积分，初始值设为2000。

```sql
CREATE TABLE Users (
    UserID INT PRIMARY KEY,
    Username VARCHAR(255),
    InitialPoints INT DEFAULT 2000
);
```

### 分享链接表（SharedLinks）
- LinkID: 主键，唯一标识每个分享链接。
- UserID: 外键，关联到用户表，标识哪个用户生成了这个链接。
- Link: 分享链接的实际URL。

```sql
CREATE TABLE SharedLinks (
    LinkID INT PRIMARY KEY,
    UserID INT,
    Link VARCHAR(2048),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
```

### 积分记录表（PointsRecords）
- RecordID: 主键，唯一标识每次积分变动。
- UserID: 外键，关联到用户表，标识哪个用户获得了积分。
- InvitedUserID: 被邀请用户的唯一标识。
- Points: 变动的积分数量，本场景中固定为2000。
- Timestamp: 积分变动的时间戳。

```sql
CREATE TABLE PointsRecords (
    RecordID INT PRIMARY KEY,
    UserID INT,
    InvitedUserID INT,
    Points INT DEFAULT 2000,
    Timestamp TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
```

### 逻辑实现
- 当用户A生成一个分享链接时，系统会在`SharedLinks`表中创建一条记录。
- 当用户B通过用户A的分享链接注册时，系统会检查这个链接是否存在于`SharedLinks`表中。如果存在，系统会在`Users`表中为用户B创建一条记录，并在`PointsRecords`表中为用户A创建一条积分记录。
- 如果用户B也生成了一个分享链接并邀请了用户C，系统会重复上述过程，但在`PointsRecords`表中为用户B创建积分记录，而不是用户A。

### 示例SQL操作
生成分享链接：
```sql
INSERT INTO SharedLinks (UserID, Link) VALUES (1, 'https://example.com/invite?by=A');
```

用户B通过分享链接注册后，为用户A添加积分：
```sql
INSERT INTO Users (Username, InitialPoints) VALUES ('B', 2000);
INSERT INTO PointsRecords (UserID, InvitedUserID, Timestamp) VALUES (1, 2, CURRENT_TIMESTAMP);
```

请注意，实际的数据库设计可能会根据应用的具体需求和业务逻辑有所变化。此外，还需要考虑安全性、隐私保护、数据一致性、并发控制和备份等其他数据库设计的重要方面。


如果用户B邀请了多个用户，积分应该为每个邀请累加。在设计的数据库中，每当用户B成功邀请一个新用户时，就会在`PointsRecords`表中为用户B创建一条新的积分记录。以下是如何实现积分累加的逻辑：

1. **积分记录表（PointsRecords）**：每当用户B通过其分享链接邀请一个新用户时，就会在该表中为用户B添加一条记录，记录中包含积分的增加。

2. **积分累加逻辑**：为了累加积分，可以为每个邀请操作生成一个唯一的`RecordID`，并且确保每个邀请事件都对应一条记录。

3. **查询积分**：为了查询用户B的总积分，可以对`PointsRecords`表进行查询，将所有积分记录累加。

以下是积分累加的示例SQL查询：

```sql
-- 计算用户B的总积分
SELECT SUM(Points) AS TotalPoints FROM PointsRecords WHERE UserID = (SELECT UserID FROM Users WHERE Username = 'B');
```

这个查询会返回用户B通过所有邀请获得的积分总和。

### 更新积分记录表以支持积分累加

为了更好地支持积分累加，我们可以在`PointsRecords`表中添加一个字段，用于跟踪每个用户的当前积分总数：

```sql
ALTER TABLE PointsRecords ADD COLUMN CurrentPoints INT DEFAULT 0;
```

每当有新的积分记录被添加时，我们更新这个`CurrentPoints`字段：

```sql
-- 每当有新的积分记录时，更新用户的当前积分
UPDATE Users SET CurrentPoints = CurrentPoints + 2000 WHERE UserID = [InvitingUserID];
```

这里，`[InvitingUserID]`是邀请新用户的用户的`UserID`。

### 注意事项

- 确保在进行积分累加操作时，处理好并发问题，避免多个事务同时修改积分导致数据不一致。
- 考虑实现事务控制，确保积分的增加和记录的添加在数据库中是原子操作。
- 定期备份数据库，以防数据丢失或损坏。

通过这样的设计，可以有效地跟踪和管理每个用户通过邀请获得的积分，并且能够方便地查询和累加积分。

为了实现这个需求，我们需要在数据库设计中添加一个钱包地址的验证机制。以下是对之前数据库设计的补充：

### 用户表（Users）的扩展
在用户表中添加一个字段来存储用户的钱包地址。

```sql
ALTER TABLE Users ADD COLUMN WalletAddress VARCHAR(255);
```

### 分享链接表（SharedLinks）的扩展
在分享链接表中添加一个字段，用于存储是否需要输入钱包地址的标志。

```sql
ALTER TABLE SharedLinks ADD COLUMN RequiresWalletAddress BOOLEAN DEFAULT TRUE;
```

### 积分记录表（PointsRecords）的逻辑调整
在积分记录表中，我们需要添加一个字段来标识积分是否成功添加。同时，我们需要一个过程或触发器来检查被邀请用户的钱包地址是否正确，并据此决定是否给邀请人添加积分。

```sql
ALTER TABLE PointsRecords ADD COLUMN PointsAdded BOOLEAN DEFAULT FALSE;
```

### 积分验证逻辑
1. 用户B通过用户A的分享链接进入系统，并输入自己的钱包地址。
2. 系统验证用户B输入的钱包地址是否有效（这可能需要集成一个外部的钱包验证服务）。
3. 如果钱包地址有效，系统在`PointsRecords`表中为用户A添加一条积分记录，并设置`PointsAdded`为`TRUE`。
4. 如果钱包地址无效，不添加积分记录。

### 示例SQL操作

用户B通过分享链接注册并输入钱包地址：
```sql
-- 假设用户B的UserID为2，用户A的UserID为1
INSERT INTO Users (Username, InitialPoints, WalletAddress) VALUES ('B', 2000, '0xValidWalletAddress');

-- 检查钱包地址是否有效（这里假设有一个函数叫做CheckWalletAddress，返回TRUE或FALSE）
-- 这里需要一个实际的验证逻辑或外部服务来实现
SELECT CheckWalletAddress('0xValidWalletAddress') INTO @IsValid;

-- 如果钱包地址有效，则为用户A添加积分
IF @IsValid THEN
    INSERT INTO PointsRecords (UserID, InvitedUserID, Timestamp, PointsAdded) 
    VALUES (1, 2, CURRENT_TIMESTAMP, TRUE);
    -- 同时更新用户A的积分
    UPDATE Users SET CurrentPoints = CurrentPoints + 2000 WHERE UserID = 1;
END IF;
```

请注意，这里使用了伪代码和MySQL的存储过程语法来描述逻辑，实际的实现可能需要根据所使用的数据库系统和编程语言进行调整。此外，`CheckWalletAddress`函数需要根据实际情况来实现，可能涉及到与区块链或其他钱包服务的集成。

### 安全性和完整性
- 确保钱包地址的验证逻辑是安全的，并且不能被轻易绕过。
- 考虑使用加密存储钱包地址，以保护用户隐私。
- 实现适当的错误处理和日志记录，以便在出现问题时能够追踪和解决。

通过这些补充，我们可以确保只有当被邀请用户输入了正确的钱包地址时，邀请人才会获得积分。