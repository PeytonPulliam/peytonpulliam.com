<h1 align="center">Hi, I'm Peyton 👋</h1>

<p align="center">
  <b>Security & data engineer</b> building detection pipelines, cloud guardrails, and privacy infrastructure, all measured and all tested.
</p>

<p align="center">
  <a href="https://peytonpulliam.com"><img src="https://img.shields.io/badge/Website-peytonpulliam.com-0A66C2?style=flat-square&logo=googlechrome&logoColor=white" alt="Website"></a>
  <a href="https://www.linkedin.com/in/peyton-pulliam-132690352/"><img src="https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat-square&logo=linkedin&logoColor=white" alt="LinkedIn"></a>
</p>

---

## About me

-  Background in **offensive security and networking**, now focused on **security data engineering** and **cloud security**
-  Incoming Data Engineer @ U.S. Air Force 
-  
## Certifications

| Certification | Issuer | Status |
| --- | --- | --- |
| **CRTO**: Certified Red Team Operator | Zero-Point Security | ![Passed](https://img.shields.io/badge/-Passed-2EA043?style=flat-square) |
| **CCNA**: Cisco Certified Network Associate | Cisco | ![Passed](https://img.shields.io/badge/-Passed-2EA043?style=flat-square) |
| **AWS Certified Data Engineer – Associate** | Amazon Web Services | ![In progress](https://img.shields.io/badge/-In%20progress-D29922?style=flat-square) |
| **CompTIA Security+** | CompTIA | ![In progress](https://img.shields.io/badge/-In%20progress-D29922?style=flat-square) |

## Projects

| # | Project | What it does | Status |
| --- | --- | --- | --- |
| 1 | **[Weight Vault](https://github.com/YOUR-USERNAME/weight-vault)** | Protects a crown-jewel asset: two-person access, egress budgets that trip before a bulk copy finishes, and decoys that alert when touched | ![Building](https://img.shields.io/badge/-Building-1F6FEB?style=flat-square) |
| 2 | **Anti-Distillation** | Detects coordinated abuse of an AI API (distillation farms, fake-account networks, scripted jailbreaks) by behavior, not just content | ![Planned](https://img.shields.io/badge/-Planned-6E7781?style=flat-square) |
| 3 | **Agent Control Plane** | Runs AI agents in locked-down sandboxes with a policy engine, full tracing, and a prompt-injection monitor, plus evals with real error bars | ![Planned](https://img.shields.io/badge/-Planned-6E7781?style=flat-square) |
| 4 | **Consent Enforcement** | Proves that opted-out or deleted data never reaches a training set: consent labels, lineage checks in CI, and verified deletion | ![Planned](https://img.shields.io/badge/-Planned-6E7781?style=flat-square) |

<details>
<summary><b>🔍 More on each project</b></summary>

### 1. Weight Vault
A monitored vault for one high-value asset. It starts with a detection pipeline (Zeek → S3 → Athena) with detections-as-code: SQL rules with YAML metadata and positive/negative test fixtures, all run in CI. It grows into a multi-account AWS vault with KMS-protected decoys, CloudTrail data events, approval-based temporary access, and per-identity egress budgets. Every exfiltration drill runs against my own decoys, and time-to-detect is published.

**Stack:** Zeek · Python · SQL · AWS (S3, Athena, Glue, KMS, CloudTrail, IAM Identity Center) · Terraform · GitHub Actions (OIDC) · pytest

### 2. Anti-Distillation
A small LLM API platform with thousands of synthetic accounts and a layered defense: a real-time classifier at the gateway, batch account-level detections, graph clustering on shared fingerprints, and a review queue with appeals. Precision, recall, and time-to-detect are published for each campaign type.

**Stack:** Python · FastAPI · Postgres · scikit-learn · NetworkX · MinHash · Kafka/Flink · open safety models

### 3. Agent Control Plane
Sandboxed infrastructure for AI agents with tool access: gVisor sandboxes with no network by default, a deny-by-default egress proxy, OPA policies on every tool call, full traces, and an automated sandbox-escape test suite that gates every release. Eval results are reported with confidence intervals.

**Stack:** Docker · gVisor · OPA · Inspect · Python · S3 · Kubernetes (when needed)

### 4. Consent Enforcement
Purpose limitation for a data lakehouse. Tables carry consent labels, CI parses every dbt model with sqlglot and blocks forbidden data flows, and a deletion job removes a user from every derived table and Iceberg snapshot, then issues a verifiable receipt.

**Stack:** dbt · sqlglot · Apache Iceberg · DuckDB · Trino · Presidio · GitHub Actions

### Shared foundation
A multi-account AWS organization in Terraform with SCP guardrails, an organization-wide CloudTrail trail, and keyless CI. Each control is proven by running attack techniques against a sandbox account and recording what was prevented, detected, or auto-remediated.

</details>

## Tech stack

**Languages**
![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![SQL](https://img.shields.io/badge/SQL-4479A1?style=flat-square&logo=postgresql&logoColor=white)
![C](https://img.shields.io/badge/C-A8B9CC?style=flat-square&logo=c&logoColor=black)
![C++](https://img.shields.io/badge/C++-00599C?style=flat-square&logo=cplusplus&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Bash](https://img.shields.io/badge/Bash-4EAA25?style=flat-square&logo=gnubash&logoColor=white)
![Assembly](https://img.shields.io/badge/Assembly-6E4C13?style=flat-square)

**Cloud & infrastructure**
![AWS](https://img.shields.io/badge/AWS-232F3E?style=flat-square&logo=amazonwebservices&logoColor=white)
![Terraform](https://img.shields.io/badge/Terraform-844FBA?style=flat-square&logo=terraform&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![Linux](https://img.shields.io/badge/Linux-FCC624?style=flat-square&logo=linux&logoColor=black)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white)

**Data**
![DuckDB](https://img.shields.io/badge/DuckDB-FFF000?style=flat-square&logo=duckdb&logoColor=black)
![Apache Iceberg](https://img.shields.io/badge/Apache%20Iceberg-4E8EE9?style=flat-square)
![dbt](https://img.shields.io/badge/dbt-FF694B?style=flat-square&logo=dbt&logoColor=white)
![Kafka](https://img.shields.io/badge/Kafka-231F20?style=flat-square&logo=apachekafka&logoColor=white)

**Security**
![Zeek](https://img.shields.io/badge/Zeek-2B5C8A?style=flat-square)
![Wireshark](https://img.shields.io/badge/Wireshark-1679A7?style=flat-square&logo=wireshark&logoColor=white)
![MITRE ATT&CK](https://img.shields.io/badge/MITRE%20ATT%26CK-C8102E?style=flat-square)
![Cisco](https://img.shields.io/badge/Cisco-1BA0D7?style=flat-square&logo=cisco&logoColor=white)

## How I build

- **Measure it or it didn't happen.** Every project publishes real numbers: detection time, precision and recall, cost per month.
- **Test the controls, not just the code.** Detections ship with fixtures, and sandboxes ship with escape tests.
- **Write down the why.** Each real decision gets a short decision record that covers the simpler option I rejected.
- **Ethical by design.** Synthetic or public data only, and only infrastructure I own.

---

<p align="center"><i>Currently building: Weight Vault v0.1, a replay-based detection pipeline with five tested detections.</i></p>
