# dsh-minimal-bash-fix

DSH 插件：修复极简模式（`minimal`）预设中 persistent bash 工具的完成检测 bug。未修复时 bash 工具会延迟约 3.5s 才返回；本插件提供 `minimal-fast` preset 解决该问题。

## 安装

```bash
dsh plugin --profile web add -w github:sd1g1/dsh-minimal-bash-fix
```

重启 DSH 后，在 DSH 中选择 `minimal-fast` preset 即可。

## 验证

```bash
echo "PS1=[$PS1]"
```

如果输出 `PS1=[dsh> ]`，说明修复已生效。
