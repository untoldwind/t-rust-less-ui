import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import React, { FormEvent, useContext, useEffect, useState } from "react";
import { BackendContext } from "../../backend/provider";
import { LockOpen } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

export const Unlock: React.FC = () => {
  const { stores, selectedStore, identities, unlockStore, lockingUnlocking } =
    useContext(BackendContext);
  const [identityId, setIdentityId] = useState<string>("");
  const [passphrase, setPassphrase] = useState<string>("");

  useEffect(() => {
    if (!selectedStore || !identities) return;
    if (identities.findIndex((identity) => identity.id === identityId) >= 0)
      return;
    if (selectedStore.default_identity_id)
      setIdentityId(selectedStore.default_identity_id);
    if (identities.length > 0) setIdentityId(identities[0].id);
  }, [stores, selectedStore, identities]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    event.stopPropagation();
    unlockStore(identityId, passphrase);
    setPassphrase("");
  }

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: "100vh" }}
    >
      <Grid item xs={3}>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            {stores && selectedStore && (
              <Tabs
                value={stores.findIndex((store) => store === selectedStore)}
                onChange={() => {}}
                aria-label="basic tabs example"
              >
                {stores?.map((store, idx) => (
                  <Tab key={idx} label={store.name} />
                ))}
              </Tabs>
            )}
          </Box>
          <FormControl fullWidth margin="normal">
            <InputLabel id="identity-select">Identity</InputLabel>
            <Select
              label="Identity"
              value={identityId}
              labelId="identity-select"
              onChange={(event) => setIdentityId(event.target.value)}
            >
              {identities?.map((identity, idx) => (
                <MenuItem key={idx} value={identity.id}>
                  {identity.email} ({identity.name})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            fullWidth
            value={passphrase}
            label="Password"
            type="password"
            autoFocus
            onChange={(event) => setPassphrase(event.target.value)}
          />
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            startIcon={<LockOpen />}
            loading={lockingUnlocking}
          >
            Unlock
          </LoadingButton>
        </Box>
      </Grid>
    </Grid>
  );
};
