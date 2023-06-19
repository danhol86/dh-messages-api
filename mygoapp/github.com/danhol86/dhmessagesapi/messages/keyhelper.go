package messages

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"math/big"
	"time"

	"github.com/lestrrat-go/jwx/jwk"
)

type PrivKeyData struct {
	D string `json:"d"`
	X string `json:"x"`
	Y string `json:"y"`
}

type PubKeyData struct {
	X string `json:"x"`
	Y string `json:"y"`
}

type SessionData struct {
	CryptoMsgEncKey       []uint8
	CryptoMsgHmac         []uint8
	Crypto_msg_enc_key    string
	Crypto_msg_hmac       string
	Pr_tachyon_auth_token string
	Bugle                 string
	Bugle15               string
	pubKeyExp             jwk.Key
	privKeyExp            jwk.Key
	CryptoPubKey          string
	CryptoPriKey          string
	UserScanId            string
	UserScanProto         string
	GoogleApi             string
	Qrbase64              string
	Qrreqdata             []byte
	eCDSAKeys             *ecdsa.PrivateKey
	Expire                time.Time
	QrLink                string
}
type Keys struct {
	CryptoMsgEncKey []uint8
	CryptoMsgHmac   []uint8
	ECDSAKeys       *ecdsa.PrivateKey
}

func GetKeysAndReturnSessionData() (*SessionData, error) {
	keys, err := GetKeys()
	if err != nil {
		return nil, err
	}
	sess, err2 := SetSessionData(keys)
	return sess, err2
}

func ArrayFromKey(key jwk.Key) ([]byte, error) {
	ecKey, ok := key.(jwk.ECDSAPublicKey)
	if !ok {
		return nil, fmt.Errorf("key is not ECDSA public key")
	}

	xBytes := ecKey.X()
	yBytes := ecKey.Y()

	newTemm := make([]byte, 1+len(xBytes)+len(yBytes))

	newTemm[0] = 4
	copy(newTemm[1:], xBytes)
	copy(newTemm[1+len(xBytes):], yBytes)

	return newTemm, nil
}

func GetRefreshToken(privkey, pubkey, refreqid string, utimestamp int64) (string, error) {
	privkeysjson, err := base64.StdEncoding.DecodeString(privkey)
	if err != nil {
		return "", err
	}
	privobj := PrivKeyData{}
	err = json.Unmarshal(privkeysjson, &privobj)
	if err != nil {
		return "", err
	}

	pubkeysjson, err := base64.StdEncoding.DecodeString(pubkey)
	if err != nil {
		return "", err
	}
	pubobj := PubKeyData{}
	err = json.Unmarshal(pubkeysjson, &pubobj)
	if err != nil {
		return "", err
	}

	xBytes, err := base64.RawURLEncoding.DecodeString(pubobj.X)
	if err != nil {
		return "", err
	}
	yBytes, err := base64.RawURLEncoding.DecodeString(pubobj.Y)
	if err != nil {
		return "", err
	}
	dBytes, err := base64.RawURLEncoding.DecodeString(privobj.D)
	if err != nil {
		return "", err
	}

	text := fmt.Sprintf("%s:%d", refreqid, utimestamp)
	byteArr := []byte(text)

	curve := elliptic.P256()

	privateKey := &ecdsa.PrivateKey{
		PublicKey: ecdsa.PublicKey{
			Curve: curve,
			X:     new(big.Int).SetBytes(xBytes),
			Y:     new(big.Int).SetBytes(yBytes),
		},
		D: new(big.Int).SetBytes(dBytes),
	}

	hash := sha256.New()
	_, err = hash.Write(byteArr)
	if err != nil {
		log.Fatal(err)
	}
	digest := hash.Sum(nil)

	r, s, err := ecdsa.Sign(rand.Reader, privateKey, digest)
	if err != nil {
		return "", err
	}

	signature := append(r.Bytes(), s.Bytes()...)

	newsig, err := EncodeUINT(signature)
	if err != nil {
		return "", err
	}

	encstr := base64.StdEncoding.EncodeToString(newsig)

	return encstr, nil
}

func EncodeUINT(c []byte) ([]byte, error) {
	b := c
	if len(b)%2 != 0 || len(b) == 0 || len(b) > 132 {
		return nil, fmt.Errorf("invalid ieee p1363 signature encoding. length: %d", len(b))
	}
	cBytes := Oha(b[:len(b)/2])
	bBytes := Oha(b[len(b)/2:])

	d := 0
	e := len(cBytes) + 4 + len(bBytes)
	var f []byte
	if e >= 128 {
		f = make([]byte, e+3)
		f[d] = 48
		f[d+1] = 129
	} else {
		f = make([]byte, e+2)
		f[d] = 48
	}
	d++
	f[d] = byte(e)
	d++
	f[d] = 2
	d++
	f[d] = byte(len(cBytes))
	d++
	copy(f[d:], cBytes)
	d += len(cBytes)
	f[d] = 2
	d++
	f[d] = byte(len(bBytes))
	d++
	copy(f[d:], bBytes)

	return f, nil
}

func Oha(a []byte) []byte {
	c := 0
	for c < len(a) && a[c] == 0 {
		c++
	}
	if c == len(a) {
		c = len(a) - 1
	}
	b := 0
	if a[c]&128 == 128 {
		b = 1
	}
	d := make([]byte, len(a)-c+b)
	copy(d[b:], a[c:])
	return d
}

func SetSessionData(keys *Keys) (*SessionData, error) {
	sessionData := &SessionData{}

	sessionData.eCDSAKeys = keys.ECDSAKeys

	// Encoding keys to base64
	sessionData.CryptoMsgEncKey = keys.CryptoMsgEncKey
	sessionData.CryptoMsgHmac = keys.CryptoMsgHmac

	sessionData.Crypto_msg_enc_key = base64.StdEncoding.EncodeToString(keys.CryptoMsgEncKey)
	sessionData.Crypto_msg_hmac = base64.StdEncoding.EncodeToString(keys.CryptoMsgHmac)

	// Exporting keys to JWK
	pubKeyExp, err := jwk.New(&keys.ECDSAKeys.PublicKey)
	if err != nil {
		return nil, fmt.Errorf("failed to export public key: %w", err)
	}
	privKeyExp, err := jwk.New(keys.ECDSAKeys)
	if err != nil {
		return nil, fmt.Errorf("failed to export private key: %w", err)
	}
	sessionData.pubKeyExp = pubKeyExp
	sessionData.privKeyExp = privKeyExp

	// Converting keys to JSON and encoding to base64
	pubKeyExpJSON, err := json.Marshal(pubKeyExp)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal public key: %w", err)
	}
	sessionData.CryptoPubKey = base64.StdEncoding.EncodeToString(pubKeyExpJSON)

	privKeyExpJSON, err := json.Marshal(privKeyExp)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal private key: %w", err)
	}
	sessionData.CryptoPriKey = base64.StdEncoding.EncodeToString(privKeyExpJSON)

	return sessionData, nil
}

func GetKeys() (*Keys, error) {
	cryptoMsgEncKey := make([]uint8, 32)
	cryptoMsgHmac := make([]uint8, 32)

	if _, err := rand.Read(cryptoMsgEncKey); err != nil {
		return nil, fmt.Errorf("failed to generate encryption key: %w", err)
	}

	if _, err := rand.Read(cryptoMsgHmac); err != nil {
		return nil, fmt.Errorf("failed to generate hmac key: %w", err)
	}

	ecdsaKeys, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		return nil, fmt.Errorf("failed to generate ECDSA key: %w", err)
	}

	return &Keys{
		CryptoMsgEncKey: cryptoMsgEncKey,
		CryptoMsgHmac:   cryptoMsgHmac,
		ECDSAKeys:       ecdsaKeys,
	}, nil
}
