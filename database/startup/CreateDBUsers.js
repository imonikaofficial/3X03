db = db.getSiblingDB("admin");

// Database User Role
db.createUser({
  user: "AdminReadWrite",
  pwd: "Y1nTmR2c&K3jPqD",
  roles: [{ role: "readWrite", db: "admin" }]
});

// Database Administration Roles
db.createUser({
  user: "AdminDB",
  pwd: "U2gH1jTmQrK7nA",
  roles: [{ role: "dbAdmin", db: "admin" }]
});

db.createUser({
  user: "AdminUser",
  pwd: "V5pLrM#KfD3tQ6",
  roles: [{ role: "userAdmin", db: "admin" }]
});

// Cluster Administration Roles
db.createUser({
  user: "AdminClusterManager",
  pwd: "J4yL3nFwXpT8rS",
  roles: [{ role: "clusterManager", db: "admin" }]
});

db.createUser({
  user: "AdminClusterMonitor",
  pwd: "B3k&fDmS$8L2vNpA",
  roles: [{ role: "clusterMonitor", db: "admin" }]
});

db.createUser({
  user: "AdminHostManager",
  pwd: "H1yPq2WzV&xL4rG6",
  roles: [{ role: "hostManager", db: "admin" }]
});

// Backup and Restoration Roles
db.createUser({
  user: "AdminBackup",
  pwd: "Z7sR8wJp#K9xTfD",
  roles: [{ role: "backup", db: "admin" }]
});

db.createUser({
  user: "AdminRestore",
  pwd: "GmQ&4nHs7wP8rVzU",
  roles: [{ role: "restore", db: "admin" }]
});

// All-Database roles
db.createUser({
  user: "AdminReadWriteDB",
  pwd: "F5sA7eGm#K8qLrT",
  roles: [{ role: "readWriteAnyDatabase", db: "admin" }]
});

db.createUser({
  user: "AdminUserDB",
  pwd: "R6tZmPqB2k8pVfD",
  roles: [{ role: "readWriteAnyDatabase", db: "admin" }]
});

db.setProfilingLevel(2);