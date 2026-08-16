# dsh-minimal-fast-preset

基于 DSH `minimal` 的 agent preset，优化 persistent bash 的 PTY 完成检测，降低单次 bash 调用延迟。

## 安装

```bash
dsh plugin --profile web add -w github:sd1g1/dsh-minimal-fast-preset#v0.1.0
```

重启 DSH 后，在 DSH 中选择 `minimal-fast` preset 即可。

## 验证

```bash
echo "PS1=[$PS1]"
```

如果输出 `PS1=[dsh> ]`，说明快速路径已生效。
