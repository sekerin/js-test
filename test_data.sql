# DROP TABLE IF EXISTS `account`;
CREATE TABLE `account` (
`login` bigint(20) unsigned NOT NULL COMMENT 'account',
`source` int(10) unsigned NOT NULL,
`balance_usd` double DEFAULT '0' COMMENT 'account balance',
`balance_usd_sub` double DEFAULT '0' COMMENT 'subscription network balance',
PRIMARY KEY (`source`, `login`)
) ENGINE=InnoDB;
INSERT INTO `account` VALUES 
('60000000000060839', '203', '20', '0'),
('60000000000060840', '203', '10', '0'),
('60000000000061841', '203', '20', '0'),
('60000000000062842', '203', '30', '0'),
('60000000000063843', '203', '40', '0'),
('60000000000064844', '203', '50', '0'),
('60000000000065845', '203', '60', '0'),
('60000000000066847', '203', '70', '0'),
('60000000000067850', '203', '80', '0'),
('60000000000068851', '203', '90', '0'),
('60000000000069853', '203', '80', '0'),
('60000000000070854', '203', '70', '0'),
('60000000000071855', '203', '60', '0'),
('60000000000072854', '203', '50', '0'),
('60000000000073855', '203', '40', '0');

#DROP TABLE IF EXISTS `subscription`;
CREATE TABLE `subscription` (
`login` bigint(20) unsigned NOT NULL COMMENT 'trader account',
`source` int(10) unsigned NOT NULL COMMENT 'trader source',
`r_login` bigint(20) unsigned NOT NULL COMMENT 'investor account',
`r_source` int(10) unsigned NOT NULL COMMENT 'investor source',
PRIMARY KEY (`source`,`login`,`r_source`,`r_login`),
KEY `r_idx` (`r_source`,`r_login`,`source`,`login`)
) ENGINE=InnoDB;
INSERT INTO `subscription` VALUES 
# 1й треугольник
('60000000000060839', '203', '60000000000060840', '203'),
('60000000000060840', '203', '60000000000061841', '203'),
('60000000000061841', '203', '60000000000060839', '203'),
# 2й треугольник
('60000000000062842', '203', '60000000000063843', '203'),
('60000000000062842', '203', '60000000000064844', '203'),
('60000000000064844', '203', '60000000000063843', '203'),
# ромб
('60000000000064844', '203', '60000000000065845', '203'),
('60000000000064844', '203', '60000000000066847', '203'),
('60000000000065845', '203', '60000000000067850', '203'),
('60000000000066847', '203', '60000000000067850', '203'),
# узлы 2го треугольника
('60000000000063843', '203', '60000000000068851', '203'),
('60000000000063843', '203', '60000000000069853', '203'),
# узлы ромба
('60000000000067850', '203', '60000000000070854', '203'),
('60000000000067850', '203', '60000000000071855', '203');


ALTER TABLE account ADD COLUMN network_id int(11);
ALTER TABLE account ADD COLUMN subscribers_count int(11) DEFAULT 0 NOT NULL;

CREATE INDEX account_network_id ON account (network_id);
