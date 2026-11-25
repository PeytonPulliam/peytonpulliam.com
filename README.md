<h1 align="center">Peyton Pulliam</h1>

<p align="center">
  <b>Software Engineer · U.S. Air Force Software Development Operations (1D7X4P)</b>
</p>

<p align="center">
  <a href="https://peytonpulliam.com"><img src="https://img.shields.io/badge/Website-peytonpulliam.com-0A66C2?style=flat-square&logo=googlechrome&logoColor=white" alt="Website"></a>
  <a
  href="https://www.linkedin.com/in/peyton-pulliam-132690352/"
  target="_blank"
  rel="noopener noreferrer"
>
  <img
    src="https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat-square&logo=linkedin&logoColor=white"
    alt="Connect on LinkedIn"
  >
</a>
</p>

---

## About me

- Software engineer focused on security infrastructure: real-time detection, privacy enforcement, and systems I prove by attacking them.

## Certifications

| Certification | Issuer | Status |
| --- | --- | --- |
| **CRTO**: Certified Red Team Operator | Zero-Point Security | ![Passed](https://img.shields.io/badge/-Passed-2EA043?style=flat-square) |
| **CCNA**: Cisco Certified Network Associate | Cisco | ![Passed](https://img.shields.io/badge/-Passed-2EA043?style=flat-square) |
| **CompTIA Security+** | CompTIA | ![Planned](https://img.shields.io/badge/-Planned-6E7781?style=flat-square) |

## Projects

Full design docs for each project are on [peytonpulliam.com](https://peytonpulliam.com).

| # | Project | What it does | Status |
| --- | --- | --- | --- |
| 1 | **Session Risk Engine** | Scores every login inline to catch account takeovers, with a p99 latency target under 20 ms | ![Building](https://img.shields.io/badge/-Building-1F6FEB?style=flat-square) |
| 2 | **Privacy Flow Guard** | Fails CI when code sends tagged personal data somewhere unapproved; a runtime proxy enforces consent | ![Design](https://img.shields.io/badge/-Design%20draft-6E7781?style=flat-square) |
| 3 | **Leak Tracer** | Invisible per-viewer video watermarks that trace a leaked copy back to its account | ![Design](https://img.shields.io/badge/-Design%20draft-6E7781?style=flat-square) |
| 4 | **Security Chaos Lab** | Attacks projects 1–3 on Kubernetes and scores each detection like a test, with an eBPF sensor | ![Design](https://img.shields.io/badge/-Design%20draft-6E7781?style=flat-square) |

**Stacks:** Go · gRPC · Redis · Postgres · Redpanda · k6 · Python · Semgrep · FFmpeg · OpenCV · Kubernetes · Terraform · eBPF · Prometheus · Grafana

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

**Building with**
![Go](https://img.shields.io/badge/Go-00ADD8?style=flat-square&logo=go&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=flat-square&logo=kubernetes&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-FF4438?style=flat-square&logo=redis&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![eBPF](https://img.shields.io/badge/eBPF-000000?style=flat-square)

**Security**
![Wireshark](https://img.shields.io/badge/Wireshark-1679A7?style=flat-square&logo=wireshark&logoColor=white)
![MITRE ATT&CK](https://img.shields.io/badge/MITRE%20ATT%26CK-C8102E?style=flat-square)
![Cisco](https://img.shields.io/badge/Cisco-1BA0D7?style=flat-square&logo=cisco&logoColor=white)

## How I build

- **Measure it or it didn't happen.** Every project publishes real numbers: latency, detection rate, time to detect.
- **Test the controls, not just the code.** Detections ship with test fixtures, and the capstone attacks everything else on purpose.
- **Write down the why.** Each real decision gets a short decision record that covers the simpler option I rejected.
- **Ethical by design.** Synthetic or public data only, and only infrastructure I own.

---

<p align="center"><i>Currently building: Session Risk Engine.</i></p>
