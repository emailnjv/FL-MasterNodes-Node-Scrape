create database MasterNodes;
use MasterNodes;
create table MasterNodes (
  CurrName varchar(60),
  Price float,
  ChangePercent float,
  Volume int,
  Marketcap float,
  ROI float,
  Nodes int,
  Required int,
  MN int
);
drop table MasterNodes;